import { HttpException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class UserMiddleWare implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const exists = true; // TODO: check if user exists

    console.log(`UserMiddleWare called`);

    if (!exists) throw new HttpException('User not found', 400);
    next();
  }
}
