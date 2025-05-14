import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginatedResult, PaginationOptions, SortOrder } from './utils/types';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(
    params: PaginationOptions,
  ): Promise<PaginatedResult<UserResponseDto>> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = params;

    const [users, total] = await this.userRepository.findAndCount({
      order: { [sort]: order.toUpperCase() as SortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
    const data = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
