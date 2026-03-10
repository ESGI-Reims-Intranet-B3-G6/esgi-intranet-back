import { IsString, MaxLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @MaxLength(512)
  title: string;

  @IsString()
  content: string;
}
