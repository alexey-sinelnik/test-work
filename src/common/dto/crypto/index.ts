import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeCryptoDto {
  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  cryptocurrency: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

export class CreateCryptoCurrencyBalanceDto {
  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
