import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { comparePass, createHashPass } from './helpers/password';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private users = new Map<string, User>();

  async create(createUserDto: CreateUserDto) {
    this.checkLogin(createUserDto.login);

    const hashPass = await createHashPass(createUserDto.password);

    const newUser: User = {
      id: uuid(),
      login: createUserDto.login,
      password: hashPass,
      version: 1,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };

    this.users.set(newUser.id, newUser);

    const { password, ...restNewUser } = newUser;
    return restNewUser;
  }

  findAll() {
    const users = Array.from(this.users.values());
    const usersDto: Omit<User, 'password'>[] = users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });
    return usersDto;
  }

  findOne(id: string) {
    const user = this.checkAndGetUser(id);
    const { password, ...restUser } = user;
    return restUser;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.checkAndGetUser(id);
    const result = await comparePass(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!result)
      throw new ForbiddenException("Old password didn't match your password");

    const newPassword = await createHashPass(updatePasswordDto.newPassword);
    const { password, ...restUser } = user;

    const updUser: Omit<User, 'password'> = {
      ...restUser,
      version: ++user.version,
      updateAt: new Date().getTime(),
    };

    this.users.set(id, { ...updUser, password: newPassword });
    return updUser;
  }

  remove(id: string) {
    this.checkAndGetUser(id);
    this.users.delete(id);
  }

  private checkAndGetUser(id: string) {
    const user = this.users.get(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private checkLogin(login: string) {
    const users = this.findAll();
    const hasLogin = users.find((user) => user.login === login);
    if (hasLogin) throw new BadRequestException('This login is already in use');
  }
}
