import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { comparePass, createHashPass } from './helpers/password';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private users = new Map<string, User>();

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPass = await createHashPass(createUserDto.password);

    const newUser = new User({
      login: createUserDto.login,
      password: hashPass,
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    await this.entityManager.save(newUser);
    return newUser;
    // this.users.set(newUser.id, newUser);

    // const { password, ...restNewUser } = newUser;
    // return restNewUser;
  }

  async findAll() {
    return await this.usersRepository.find();
    // const users = Array.from(this.users.values());
    // const usersDto: Omit<User, 'password'>[] = users.map((user) => {
    //   const { password, ...restUser } = user;
    //   return restUser;
    // });
    // return usersDto;
  }

  async findOne(id: string) {
    return await this.usersRepository.findOneBy({ id });
    // const user = this.checkAndGetUser(id);
    // const { password, ...restUser } = user;
    // return restUser;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.checkAndGetUser(id);
    const result = await comparePass(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!result)
      throw new ForbiddenException("Old password didn't match your password");

    const newPassword = await createHashPass(updatePasswordDto.newPassword);

    user.password = newPassword;

    await this.entityManager.save(user);
    return user;
    // const { password, ...restUser } = user;

    // const updUser: Omit<User, 'password'> = {
    //   ...restUser,
    //   version: ++user.version,
    //   updatedAt: new Date().getTime(),
    // };

    // this.users.set(id, { ...updUser, password: newPassword });
    // return updUser;
  }

  async remove(id: string) {
    await this.checkAndGetUser(id);
    await this.usersRepository.delete(id);
    // this.users.delete(id);
  }

  private async checkAndGetUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
