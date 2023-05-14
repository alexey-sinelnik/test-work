import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../../common/dto/users';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPublicUser } from '../../common/responses/users';
import { JWTAuthGuard } from '../../guards/jwt-guard';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiTags('API')
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201 })
  @UseGuards(JWTAuthGuard)
  @Patch('update')
  update(@Body() dto: UpdateUserDto, @Req() request) {
    const user = request.user;
    return this.userService.updateUser(user, dto);
  }

  @ApiTags('API')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: IPublicUser })
  @HttpCode(200)
  @UseGuards(JWTAuthGuard)
  @Get('public')
  getPublicUser(@Query('email') email: string): Promise<User> {
    return this.userService.getPublicUser(email);
  }

  @ApiTags('API')
  @ApiQuery({ name: 'id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @UseGuards(JWTAuthGuard)
  @Delete()
  deleteUser(@Query('id') id: string): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
