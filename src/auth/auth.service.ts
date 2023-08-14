import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { comparePass } from 'src/utility/utils';
import { UserService } from 'src/user/user.service';
import { EntityManager } from 'typeorm';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.userService.checkLogin(
      createUserDto.login,
      'login',
    );

    const result = await comparePass(createUserDto.password, user.password);

    if (!result) {
      throw new ForbiddenException('Wrong login/password');
    }
    const payload = { userId: user.id, login: user.login };

    const token = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    const decodeToken = this.jwtService.decode(token);
    const timeInSec = new Date().getTime() / 1000;
    const expIn = +(decodeToken['exp'] - timeInSec).toFixed(0);

    return {
      accessToken: token,
      expiresIn: expIn,
      tokenType: 'Bearer',
      refreshToken,
    };
  }

  async refresh(refreshUserDto: RefreshAuthDto) {}
}
