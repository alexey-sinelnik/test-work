import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../starategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secret'),
        signOptions: { expiresIn: configService.get<string>('expireJwt') },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenModule {}
