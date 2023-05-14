import { IsString } from 'class-validator';

export class payloadTokenDto {
  @IsString()
  email: string;

  @IsString()
  id: string;
}
