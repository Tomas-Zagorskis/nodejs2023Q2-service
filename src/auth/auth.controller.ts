import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SkipAuth } from './skipAuth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('/signup')
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signup(@Body(new ValidationPipe()) createAuthDto: CreateUserDto) {
    return await this.authService.create(createAuthDto);
  }

  @SkipAuth()
  @Post('/login')
  @HttpCode(200)
  @ApiCreatedResponse({ description: 'Successfully logged in' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Wrong login/password' })
  async login(@Body(new ValidationPipe()) createAuthDto: CreateUserDto) {
    return await this.authService.login(createAuthDto);
  }

  @SkipAuth()
  @Post('/refresh')
  @HttpCode(200)
  @ApiCreatedResponse({ description: 'Authorized' })
  @ApiUnauthorizedResponse({ description: 'Missing token' })
  @ApiForbiddenResponse({ description: 'Token expired' })
  async refresh(@Req() req: Request) {
    return await this.authService.refresh(req['user']);
  }
}
