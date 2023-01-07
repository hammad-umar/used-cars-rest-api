import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersController } from '../users.controller';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      signup(email, password) {
        return Promise.resolve({
          id: 1,
          email,
          password,
          admin: false,
          reports: [],
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should defined the instance', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return the user with sessions', async () => {
      const session = { userId: null };
      const user = await controller.createUser(
        {
          email: 'hammad@gmail.com',
          password: '123456',
        },
        session,
      );

      expect(user).toBeDefined();
      expect(session.userId).not.toBeNull();
      expect(session.userId).toEqual(user.id);
    });

    it('should throw an error if email is already in use', async () => {
      const session = { userId: null };
      mockAuthService.signup = () => {
        throw new BadRequestException('Email is already in use!');
      };

      await expect(
        controller.createUser(
          {
            email: 'hammad123@gmail.com',
            password: '78678612',
          },
          session,
        ),
      ).rejects.toEqual(new BadRequestException('Email is already in use!'));
    });
  });

  describe('logOut', () => {
    it('should remove the sessions', () => {
      const session = { userId: 10 };

      controller.logOut(session);

      expect(session.userId).toBeNull();
    });
  });
});
