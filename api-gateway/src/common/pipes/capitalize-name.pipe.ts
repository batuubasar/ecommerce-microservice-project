import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface NameValue {
  name: string;
}

@Injectable()
export class CapitalizeNamePipe implements PipeTransform {
  transform(value: NameValue) {
    if (!value || typeof value.name !== 'string') {
      throw new BadRequestException('Invalid name field.');
    }

    value.name = value.name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return value;
  }
}
