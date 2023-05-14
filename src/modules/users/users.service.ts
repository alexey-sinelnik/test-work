import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AppErrors } from '../../common/errors';
import { CreateUserDto, UpdateUserDto } from '../../common/dto/users';
import { USER_SELECT_FIELDS } from '../../common/constants/prisma';
import { payloadTokenDto } from '../../common/dto/token';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<any> {
    const isUserExist: User = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (isUserExist) throw new BadRequestException(AppErrors.USER_EXISTS);
    const salt = await bcrypt.genSalt();
    dto.password = await this.hashPassword(dto.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password,
      },
      select: {
        ...USER_SELECT_FIELDS,
      },
    });

    const payload: payloadTokenDto = {
      id: newUser.id,
      email: newUser.email,
    };

    const token: string = await this.tokenService.generateJwtToken(payload);
    return { ...newUser, token };
  }

  public async getPublicUser(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        ...USER_SELECT_FIELDS,
      },
    });
    if (!user) throw new BadRequestException(AppErrors.USER_NOT_EXIST);
    return user;
  }

  public async getUserById(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECT_FIELDS,
      },
    });
  }

  public async getAppUser(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async getAllUsers(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: {
        ...USER_SELECT_FIELDS,
      },
    });
  }

  public async updateUser(user: User, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      data: dto,
      where: { id: user.id },
    });
  }

  public async deleteUser(id: string): Promise<boolean> {
    const isUserExists = await this.getUserById(id);
    if (!isUserExists) throw new BadRequestException(AppErrors.USER_NOT_EXIST);
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  private async hashPassword(password, salt): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
