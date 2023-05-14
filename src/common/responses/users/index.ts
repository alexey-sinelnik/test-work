import { ApiProperty } from '@nestjs/swagger';
import { ICurrency } from '../../interfaces/currency';

export class AuthUserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  balanceInCryptoCurrency?: ICurrency[];

  @ApiProperty()
  balanceInCurrency?: ICurrency[];

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class IPublicUser {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  balanceInCryptoCurrency?: [];

  @ApiProperty()
  balanceInCurrency?: [];

  @ApiProperty()
  createdAt: Date;
}
