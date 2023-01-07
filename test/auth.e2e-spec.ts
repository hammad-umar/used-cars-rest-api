import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signing up a new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'new2@new.com', password: 'new123' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(id).toBeDefined();
        expect(email).toEqual('new2@new.com');
      });
  });

  it('handles the currently logged in user', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'test@test.com',
      password: 'password123',
    });

    const cookie = res.get('Set-Cookie');

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200)
      .then(({ body }) => {
        const { id, email } = body;

        expect(id).toBeDefined();
        expect(email).toBeDefined();
      });
  });
});
