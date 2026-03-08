import { IsArray, IsEmail, IsIn, IsString, ValidateNested } from 'class-validator';
import { type Role, RolesList } from '../types/role.type';

export class EditUserId {
  @IsEmail()
  email: string;
}

export class EditUsersRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  users: EditUserId[];

  @IsString()
  group: string;

  @IsIn(RolesList)
  userRole: Role;
}
