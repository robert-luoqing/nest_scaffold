import { jsonUtil } from './../../utils/json.util';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { getUserFromToken } from '../decorator/tokenHandler';
import { MyJwtService } from './myjwt.service';
import { Reflector } from '@nestjs/core';
import { UserPermission } from '../../user/model/userPermission';

@Injectable()
export class MyAuthGuard implements CanActivate {
  constructor(
    private jwtService: MyJwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = getUserFromToken(request);

    const handler = context.getHandler(); // 获取当前路由方法
    const controller = context.getClass(); // 获取当前类
    const controllerPermissions =
      this.reflector.get<UserPermission[]>('permissions', controller) || null;
    const handlerPermissions =
      this.reflector.get<UserPermission[]>('permissions', handler) || null;
    const permissions = handlerPermissions ?? controllerPermissions;

    if (!user) {
      throw new UnauthorizedException('Failed to authenticate user');
    }

    const userPermissions: UserPermission[] | null = jsonUtil.safeParse(
      user?.permission,
    );

    if (permissions.length > 0) {
      for (const permission of permissions) {
        if (userPermissions.includes(permission)) {
          return true;
        }
      }

      throw new UnauthorizedException(
        'Failed to authenticate user for permission',
      );
    }

    return true;
  }
}
