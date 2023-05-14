import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../configuration';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/tokenModule';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    CurrencyModule,
    UsersModule,
    AuthModule,
    TokenModule,
  ],
})
export class AppModule {}
