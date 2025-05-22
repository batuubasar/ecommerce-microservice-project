import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  PaginatedResult,
  PaginationOptions,
  SortOrder,
  UpdateUserDto,
  UserResponseDto,
} from '@ecommerce/types';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create(createUserDto);
    const saved = await this.userRepository.save(user);
    return saved.toResponseDto();
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
    const data = users.map((user) => user.toResponseDto()); //plaintoinstance hata veriyordu buna dondum
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

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user.toResponseDto();
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updated = Object.assign(user, updateUserDto);
    await this.userRepository.save(updated);

    return updated.toResponseDto();
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: `User with id ${id} removed successfully` };
  }
}
