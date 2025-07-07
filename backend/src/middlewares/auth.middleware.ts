/* eslint-disable prettier/prettier */
// middlewares/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        console.log({ authHeader });

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("You're unauthorized");
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.SECRET as string);
            console.log({ decoded });

            req['user'] = decoded; // attach user to request
            next();
        } catch (err) {
            if (err) {
                throw new UnauthorizedException('Invalid token');
            }
        }
    }
}
