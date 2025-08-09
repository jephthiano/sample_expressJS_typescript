import User from '#model/User.schema.js';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
