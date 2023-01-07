import { rm } from 'fs/promises';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Report } from '../src/reports/report.entity';
import { User } from '../src/users/user.entity';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

global.afterEach(async () => {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'test.sqlite',
    entities: [User, Report],
    synchronize: true,
  });

  await dataSource.initialize();
  await dataSource.destroy();
});
