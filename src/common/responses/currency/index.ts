import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConvertCryptoCurrencyResponse {
  @ApiProperty()
  @IsString()
  result: number;
}
