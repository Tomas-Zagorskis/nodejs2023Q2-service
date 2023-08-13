import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { comparePass, createHashPass } from 'src/user/helpers/password';
import { EntityManager } from 'typeorm';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly entityManager: EntityManager) {}

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
