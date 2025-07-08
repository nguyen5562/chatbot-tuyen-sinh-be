import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ROLE_CONST } from '../../../const/role.const';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @IsIn(ROLE_CONST)
  role?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  lockedUntil?: Date;
}
