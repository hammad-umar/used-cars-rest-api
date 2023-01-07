import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
