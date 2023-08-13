import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { comparePass, createHashPass } from 'src/user/helpers/password';
import { EntityManager } from 'typeorm';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateAuthDto) {
    await this.checkLogin(createUserDto.login, 'create');
    const hashPass = await createHashPass(createUserDto.password);

    const newUser = new User({
      login: createUserDto.login.toLowerCase(),
      password: hashPass,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    const savedUser = await this.entityManager.save(newUser);

    return savedUser.toResponse();
  }

  async login(createUserDto: CreateAuthDto) {
    const user = await this.checkLogin(createUserDto.login, 'login');

    const result = await comparePass(createUserDto.password, user.password);

    if (!result) {
      throw new ForbiddenException('Wrong login/password');
    }
    const payload = { userId: user.id, login: user.login };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    const decodeToken = this.jwtService.decode(token);
    const expIn = +(decodeToken['exp'] - new Date().getTime() / 1000).toFixed(
      0,
    );

    return {
      accessToken: token,
      expiresIn: expIn,
      tokenType: 'Bearer',
      refreshToken,
    };
  }

  async refresh(refreshUserDto: RefreshAuthDto) {}

  private async checkLogin(login: string, action: 'create' | 'login') {
    const user = await this.entityManager.findOneBy(User, {
      login: login.toLowerCase(),
    });
    if (user && action === 'create')
      throw new BadRequestException('Login already exist!');
    if (!user && action === 'login')
      throw new ForbiddenException('Wrong login/password');
    return user;
  }
}
