import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class LoginDto {
  //VALIDATOR HATASINDAN DOLAYI YA COKLAYACAKTIM YA DA @VALIDATOR SILECEKTIM 2-3 TANE OLDUGUNDAN GECICI COZUM COKLADIM
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
