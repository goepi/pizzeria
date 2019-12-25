import { NextFunction, Request, Response } from 'express';

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.token) {
    console.log('We have a token');
  }

  next();
};
