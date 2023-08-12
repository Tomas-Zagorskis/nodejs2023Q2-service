import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { comparePass, createHashPass } from './helpers/password';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
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
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    const savedUser = await this.entityManager.save(newUser);

    return savedUser.toResponse();
  }

  async findAll() {
    const users = await this.usersRepository.find();
    const usersWithCorrectType = users.map((user) => user.toResponse());
    return usersWithCorrectType;
  }

  async findOne(id: string) {
    const user = await this.checkAndGetUser(id);
    return user.toResponse();
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
    user.version += 1;
    user.updatedAt = new Date().getTime();

    await this.entityManager.save(user);

    return user.toResponse();
  }

  async remove(id: string) {
    await this.checkAndGetUser(id);
    await this.usersRepository.delete(id);
  }

  private async checkAndGetUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
