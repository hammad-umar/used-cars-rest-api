import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UsersService } from '../users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    // Jest mock functions implementation
    mockUsersRepository = {
      create: jest.fn().mockReturnValue({
        id: 1,
        email: 'hammad@gmail.com',
        password: '123456',
      }),
      save: jest.fn().mockResolvedValue({
        id: 1,
        email: 'hammad@gmail.com',
        password: '123456',
      }),
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        email: 'hammad@gmail.com',
        password: '123456',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create the instance', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return the user', async () => {
      const user = await service.create('hammad@gmail.com', '123456');

      expect(user).toBeDefined();
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        email: 'hammad@gmail.com',
        password: '123456',
      });
      expect(mockUsersRepository.save).toBeCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('should return the user if valid ID is provided', async () => {
      const user = await service.findOne(1);

      expect(user).toBeDefined();
      expect(user.id).toEqual(1);
    });

    it('should throws an error if provided ID is not valid', async () => {
      mockUsersRepository.findOne = () => null;

      await expect(service.findOne(20)).rejects.toEqual(
        new NotFoundException('User not found!'),
      );
    });
  });
});
