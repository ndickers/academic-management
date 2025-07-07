/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from 'src/types/user-payload';


export function RoleGuard(allowedRoles: string[]): CanActivate {
  @Injectable()
  class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const req: any = context.switchToHttp().getRequest();
      const user = req.user as UserPayload

      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }

      if (!allowedRoles.includes(user.role as string)) {
        throw new ForbiddenException(
          `User role '${user.role}' does not have access`,
        );
      }
      return true;
    }
  }

  return new RoleGuard();
}
