import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  PaginatedResult,
  PaginationOptions,
  UpdateUserDto,
  USER_PATTERNS,
  UserResponseDto,
} from '@ecommerce/types';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: USER_PATTERNS.Create })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: USER_PATTERNS.FindAll })
  findAll(
    @Payload() paginationParams: PaginationOptions,
  ): Promise<PaginatedResult<UserResponseDto>> {
    return this.usersService.findAll(paginationParams);
  }

  @MessagePattern({ cmd: USER_PATTERNS.FindOne })
  findOne(@Payload() payload: { id: number }) {
    return this.usersService.findOne(payload.id);
  }

  @MessagePattern({ cmd: USER_PATTERNS.FindByEmail })
  findByEmail(@Payload() payload: { email: string }) {
    return this.usersService.findByEmail(payload.email);
  }

  @MessagePattern({ cmd: USER_PATTERNS.Update })
  update(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto },
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @MessagePattern({ cmd: USER_PATTERNS.Remove })
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
