import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import {
  CreateCryptoCurrencyBalanceDto,
  ExchangeCryptoDto,
} from '../../common/dto/crypto';
import { JWTAuthGuard } from '../../guards/jwt-guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConvertCryptoCurrencyResponse } from '../../common/responses/currency';

@Controller('crypto')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiTags('API')
  @ApiBody({ type: ExchangeCryptoDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ConvertCryptoCurrencyResponse })
  @Post('convert-cryptocurrency')
  convertCryptoCurrency(
    @Body() exchangeDto: ExchangeCryptoDto,
  ): Promise<number | ConflictException> {
    return this.currencyService.convertCryptoCurrency(exchangeDto);
  }

  @ApiTags('API')
  @ApiBody({ type: CreateCryptoCurrencyBalanceDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @UseGuards(JWTAuthGuard)
  @Post('add-currency-to-balance')
  addCurrencyToBalance(
    @Body() createCryptoCurrencyBalance: CreateCryptoCurrencyBalanceDto,
    @Req() request,
  ) {
    const user = request.user;
    return this.currencyService.createCryptoCurrencyBalance(
      createCryptoCurrencyBalance,
      user,
    );
  }
}
