import { IsArray, ValidateNested } from 'class-validator';
import { EditUserId } from './edit-users.dto';

export class EditUsersActivationRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  users: EditUserId[];
}
