import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { comparePass } from 'src/utility/utils';
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

    if (!result) throw new ForbiddenException('Wrong login/password');

    return await this.getJwtResponse(user.id, user.login);
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    if (!refreshAuthDto.refreshToken) throw new UnauthorizedException();

    let payload: { userId: string; login: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshAuthDto.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });
    } catch {
      throw new ForbiddenException();
    }

    const user = await this.entityManager.findOneBy(User, {
      id: payload.userId,
    });

    if (!user) throw new ForbiddenException();

    return await this.getJwtResponse(user.id, user.login);
  }

  private async getJwtResponse(userId: string, login: string) {
    const { accessToken, refreshToken } = await this.getTokens(userId, login);

    const decodeToken = this.jwtService.decode(accessToken);
    const timeInSec = new Date().getTime() / 1000;
    const expIn = +(decodeToken['exp'] - timeInSec).toFixed(0);
    await this.entityManager.update(User, { id: userId }, { refreshToken });
    return {
      accessToken,
      expiresIn: expIn,
      tokenType: 'Bearer',
      refreshToken,
    };
  }

  async getTokens(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        userId: userId,
        login,
      }),
      this.jwtService.signAsync(
        {
          userId: userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
          expiresIn: this.configService.get<string>(
            'TOKEN_REFRESH_EXPIRE_TIME',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
