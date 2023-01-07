import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signup(email: string, password: string): Promise<User> {
    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new BadRequestException('Email is already in use!');
    }

    const hashedPassword = await hash(password, 12);
    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  async signin(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Invalid Credentials!');
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new NotFoundException('Invalid Credentials!');
    }

    return user;
  }
}
