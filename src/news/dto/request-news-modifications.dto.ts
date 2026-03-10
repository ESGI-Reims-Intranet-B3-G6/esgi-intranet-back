import { IsString } from 'class-validator';

export class RequestNewsModificationsDto {
  @IsString()
  modifications: string;
}
