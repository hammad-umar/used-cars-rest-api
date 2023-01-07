import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      findByEmail(email) {
        return Promise.resolve({
          id: 1,
          email,
          password: '123456',
        } as User);
      },
      create(email, password) {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should create the instance', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create and return the user with hashed password if email is not already in use', async () => {
      mockUsersService.findByEmail = () => null;

      const user = await service.signup('hammad@gmail.com', '123456');

      expect(user).toBeDefined();
      expect(user.password).not.toBe('123456');
    });

    it('should throws error if the email is already in use', async () => {
      await expect(
        service.signup('hammad@gmail.com', '123456'),
      ).rejects.toEqual(new BadRequestException('Email is already in use!'));
    });
  });

  describe('signin', () => {
    it('should return the user if provided email and password is valid', async () => {
      mockUsersService.findByEmail = () =>
        Promise.resolve({
          id: 1,
          email: 'hammad@gmail.com',
          password:
            '$2a$12$QI/ICRAESjYCOr.cSepElukzoXBby7ZrW2wynFZxVXa.xGD7RzRSS',
          admin: false,
          reports: [],
        });

      const user = await service.signin('hammad@gmail.com', '123456');

      expect(user).toBeDefined();
    });

    it('should throws an error if provided email is not in use', async () => {
      mockUsersService.findByEmail = () => null;

      await expect(
        service.signin('hammad@gmail.com', '123456'),
      ).rejects.toEqual(new NotFoundException('Invalid Credentials!'));
    });

    it('should throws an error if provided password is not valid', async () => {
      mockUsersService.findByEmail = () =>
        Promise.resolve({
          id: 1,
          email: 'hammad@gmail.com',
          password: '123456',
          admin: false,
          reports: [],
        });

      await expect(
        service.signin('hammad@gmail.com', '123456'),
      ).rejects.toEqual(new NotFoundException('Invalid Credentials!'));
    });
  });
});
