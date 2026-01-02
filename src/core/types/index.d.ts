import { IdType } from './id';

declare global {
  namespace Express {
    interface Request {
      user?: IdType;
    }
  }
}
