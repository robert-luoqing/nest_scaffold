import { AuthGuard, CurrentUser } from '../../common/decorator/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';
import { UserCreateModel } from '../model/userCreate.model';
import { UserUpdateModel } from '../model/userUpdate.model';
import { UserChangePasswordModel } from '../model/userChangePassword.model';
import { UserResetPasswordModel } from '../model/resetPassword.model';
import { UserPermission } from '../model/userPermission';

@Controller('user')
@AuthGuard(UserPermission.User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(@Query('id') id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Get('page')
  async findUsersByPage(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ total: number; users: User[] }> {
    const users = await this.userService.findUsersByPage(page, limit);
    return users;
  }

  @Post()
  async createUser(
    @CurrentUser() currentUser: User,
    @Body() data: UserCreateModel,
  ): Promise<number> {
    const userId = await this.userService.createUser(currentUser, data);
    return userId;
  }

  @Put(':id')
  async updateUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() data: UserUpdateModel,
  ): Promise<void> {
    await this.userService.updateUser(currentUser, id, data);
  }

  /**
   * 修改自己的密码
   */
  @Post('password')
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() data: UserChangePasswordModel,
  ): Promise<void> {
    await this.userService.changePassword(
      currentUser,
      data.oldPassword,
      data.newPassword,
    );
  }

  /**
   * 重置指定用户的密码
   */
  @Post('reset/:id')
  async resetUserPassword(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() data: UserResetPasswordModel,
  ): Promise<void> {
    await this.userService.resetUserPassword(currentUser, id, data.newPassword);
  }

  @Delete(':id')
  async deleteUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
  ): Promise<void> {
    await this.userService.deleteUser(currentUser, id);
  }
}
