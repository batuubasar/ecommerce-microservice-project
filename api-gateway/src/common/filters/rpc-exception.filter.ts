import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (typeof error === 'string') {
      try {
        const parsed = JSON.parse(error);
        status = parsed?.statusCode ?? status;
        message = parsed?.message ?? message;
      } catch {
        message = error;
      }
    } else if (typeof error === 'object' && error !== null) {
      const err = error as { statusCode?: number; message?: string };
      status = err.statusCode ?? status;
      message = err.message ?? message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
