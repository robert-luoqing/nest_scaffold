import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { getUserFromToken } from './tokenHandler';
import { MyAuthGuard } from '../auth/auth.guard';
import { UserPermission } from '../../user/model/userPermission';
import { User } from '../../user/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    const user = getUserFromToken(request);
    return user;
  },
);

export const AuthGuard = (...permissions: UserPermission[]) => {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(MyAuthGuard),
  );
  // return UseGuards(MyAuthGuard);
};
