import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { AuthService } from './auth.service';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signup(@Body(new ValidationPipe()) createAuthDto: CreateAuthDto) {
    return await this.authService.create(createAuthDto);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiCreatedResponse({ description: 'Successfully logged in' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Wrong login/password' })
  async login(@Body(new ValidationPipe()) createAuthDto: CreateAuthDto) {
    return await this.authService.login(createAuthDto);
  }

  @Post('/refresh')
  @HttpCode(200)
  @ApiCreatedResponse({ description: 'Successfully logged in' })
  @ApiUnauthorizedResponse({ description: 'Missing token' })
  @ApiForbiddenResponse({ description: 'Token expired' })
  async refresh(@Body(new ValidationPipe()) refreshAuthDto: RefreshAuthDto) {
    return await this.authService.refresh(refreshAuthDto);
  }
}
