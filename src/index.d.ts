import { User } from './users/user.entity';

declare global {
  namespace Express {
    interface Request {
      session?: {
        userId?: number | null;
      };
      currentUser?: User | null;
    }
  }
}
