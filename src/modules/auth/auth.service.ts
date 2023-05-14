import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../../common/dto/users';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { AppErrors } from '../../common/errors';
import { AuthLoginDTO } from '../../common/dto/auth';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse, IPublicUser } from '../../common/responses/users';
import { User } from '@prisma/client';
import { payloadTokenDto } from '../../common/dto/token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  public async registerUser(dto: CreateUserDto): Promise<AuthUserResponse> {
    return this.userService.createUser(dto);
  }

  public async loginUser(dto: AuthLoginDTO): Promise<AuthUserResponse> {
    const user: User | IPublicUser = await this.userService.getAppUser(
      dto.email,
    );
    if (!user) throw new BadRequestException(AppErrors.USER_NOT_EXIST);
    const checkPassword = await bcrypt.compare(dto.password, user.password);
    if (!checkPassword)
      throw new ConflictException(AppErrors.PASSWORD_NOT_VALID);
    const payload: payloadTokenDto = {
      email: dto.email,
      id: user.id,
    };
    const token: string = await this.tokenService.generateJwtToken(payload);
    const publicUser = await this.userService.getPublicUser(dto.email);
    return { ...publicUser, token };
  }
}
