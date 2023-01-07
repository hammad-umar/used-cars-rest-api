import {
  Controller,
  Post,
  Get,
  Body,
  Session,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';

interface ISession {
  userId?: number | null;
}

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  me(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: ISession) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: ISession) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  logOut(@Session() session: ISession) {
    session.userId = null;
  }
}
