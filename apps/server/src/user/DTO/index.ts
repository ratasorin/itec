import { UserDB } from '@shared';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements Omit<UserDB, 'id'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  admin: boolean;
}
