import { UserRole } from "users/types";

export class UserResponseDto {
  id: number;

  name: string;

  email: string;

  birthdate: Date;

  role: UserRole;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UserDto {
  id: number;
  name: string;
  email: string;
  birthdate: Date;
  role: UserRole;
  password: string;
}

