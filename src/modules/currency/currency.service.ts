import { ConflictException, Injectable, Logger } from '@nestjs/common';
import {
  CreateCryptoCurrencyBalanceDto,
  ExchangeCryptoDto,
} from '../../common/dto/crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BalanceInCryptoCurrency, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { IPublicUser } from '../../common/responses/users';
import { ICurrency } from '../../common/interfaces/currency';
import { Cron } from '@nestjs/schedule';
import { Currency } from '../../common/enums';

const KrakenClient = require('kraken-api');
const kraken = new KrakenClient();

@Injectable()
export class CurrencyService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async convertCryptoCurrency(exchangeDto: ExchangeCryptoDto): Promise<number> {
    try {
      const result = await kraken.api('Ticker', {
        pair: `${exchangeDto.cryptocurrency}/${exchangeDto.currency}`,
      });
      const data = Object.values(result.result)[0];
      const price = Object.values(data)[0];
      return price[0] * exchangeDto.amount;
    } catch (e) {
      Logger.error(e);
      throw new ConflictException(e.message);
    }
  }

  public async createCryptoCurrencyBalance(
    createCryptoCurrencyBalanceDto: CreateCryptoCurrencyBalanceDto,
    user: User,
  ) {
    const currentUser: IPublicUser = await this.userService.getPublicUser(
      user.email,
    );
    if (
      currentUser.balanceInCryptoCurrency.some(
        (element: ICurrency): boolean =>
          element.currency === createCryptoCurrencyBalanceDto.currency,
      )
    ) {
      return currentUser.balanceInCryptoCurrency.map(
        async (element: ICurrency) => {
          if (element.currency === createCryptoCurrencyBalanceDto.currency) {
            const newAmount: number = (element.amount +=
              createCryptoCurrencyBalanceDto.amount);
            return this.prisma.balanceInCryptoCurrency.update({
              data: { amount: newAmount },
              where: { id: element.id },
            });
          }
        },
      );
    }
    return this.prisma.balanceInCryptoCurrency.create({
      data: {
        currency: createCryptoCurrencyBalanceDto.currency,
        amount: createCryptoCurrencyBalanceDto.amount,
        userId: user.id,
      },
    });
  }

  @Cron('0 0 0 * * *')
  private async checkUserBalanceInCurrency() {
    const users: IPublicUser[] = await this.userService.getAllUsers();
    for (const user of users) {
      if (user.balanceInCryptoCurrency.length !== 0) {
        for (const element of user.balanceInCryptoCurrency as BalanceInCryptoCurrency[]) {
          const balance = await this.convertCryptoCurrency({
            currency: 'USD',
            cryptocurrency: element.currency,
            amount: element.amount,
          });
          console.log(balance);
          if (user.balanceInCurrency.length !== 0) {
            user.balanceInCurrency.map(async (element: ICurrency) => {
              return this.prisma.balanceInCurrency.update({
                data: { amount: balance },
                where: { id: element.id },
              });
            });
          }

          if (user.balanceInCurrency.length === 0) {
            return this.prisma.balanceInCurrency.create({
              data: {
                currency: Currency.USD,
                amount: balance,
                userId: user.id,
              },
            });
          }
        }
      }
    }
  }
}
