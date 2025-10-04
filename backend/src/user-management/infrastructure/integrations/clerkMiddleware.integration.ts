import { clerkMiddleware } from '@clerk/express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClerkMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const middlewareFn = clerkMiddleware(); // returns a function (req, res, next) => { ... }
    return middlewareFn(req, res, next);
  }
}
