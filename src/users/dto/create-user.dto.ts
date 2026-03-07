import { IsEmail, IsIn, IsOptional } from 'class-validator';
import { type Role, RolesList } from '../types/role.type';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(RolesList)
  userRole?: Role;
}
