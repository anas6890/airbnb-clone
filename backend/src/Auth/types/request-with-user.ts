// src/auth/types/request-with-user.ts
export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}
