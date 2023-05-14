import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../common/dto/users';
import { AuthLoginDTO } from '../../common/dto/auth';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserResponse } from '../../common/responses/users';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('API')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: AuthUserResponse })
  @HttpCode(201)
  @Post('register')
  register(@Body() dto: CreateUserDto): Promise<AuthUserResponse> {
    return this.authService.registerUser(dto);
  }

  @ApiTags('API')
  @ApiBody({ type: AuthLoginDTO })
  @ApiResponse({ status: 200, type: AuthUserResponse })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: AuthLoginDTO): Promise<AuthUserResponse> {
    return this.authService.loginUser(dto);
  }
}
