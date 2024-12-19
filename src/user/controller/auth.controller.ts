import { CurrentUser } from './../../common/decorator/auth';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';
import { LoginReq } from '../model/loginReq.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() data: LoginReq): Promise<{ token: string; user: User }> {
    const result = await this.userService.login(data);
    return result;
  }

  @Get('login2')
  async login2(
    @Query('username') username: string,
    @Query('password') password: string,
  ): Promise<{ token: string; user: User }> {
    const result = await this.userService.login({
      userName: username,
      password,
    });
    return result;
  }

  @Post('logout')
  async logout(@CurrentUser() currentUser: User): Promise<void> {
    await this.userService.logout(currentUser);
  }

  @Get('me')
  async getMyInfo(@CurrentUser() currentUser: User): Promise<User | null> {
    if (currentUser) {
      const user = await this.userService.findOne(currentUser.id);
      return user;
    }
    return null;
  }
}
