import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  password: string;

  @IsOptional()
  birthdate: Date;
}
