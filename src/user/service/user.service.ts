import { hashUtil } from '../../utils/hash.util';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { LoginReq } from '../model/loginReq.model';
import { MyJwtService } from '../../common/auth/myjwt.service';
import { UserCreateModel } from '../model/userCreate.model';
import { SPError } from '../../common/exception/spError';
import { SPErrorType } from '../../common/exception/spErrorType';
import { UserUpdateModel } from '../model/userUpdate.model';
import { RedisService } from '../../common/redis/redis.service';
import { RedisKey } from 'src/common/redis/redis.key';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: MyJwtService,
    private redisService: RedisService,
  ) {}

  async login(data: LoginReq): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findByUserName(data.userName);
    if (!user) {
      throw new SPError(
        SPErrorType.NoPermission,
        'User name and password incorrect',
      );
    }
    const passwordCompareResult = await hashUtil.comparePasswords(
      data.password,
      user.password,
    );
    if (!passwordCompareResult) {
      throw new SPError(
        SPErrorType.NoPermission,
        'User name and password incorrect',
      );
    }

    user.password = '';
    const token = await this.jwtService.signAsync(user);

    return {
      token,
      user,
    };
  }

  logout(currentUser: User) {
    console.log('logout', currentUser?.id);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    user.password = '';
    return user;
  }

  async findUsersByPage(
    page: number,
    limit: number,
  ): Promise<{ total: number; users: User[] }> {
    const result = await this.userRepository.findUsersByPage(page, limit);
    for (const user of result.users) {
      user.password = '';
    }
    return result;
  }

  async createUser(currentUser: User, data: UserCreateModel): Promise<number> {
    const existUser = await this.userRepository.findByUserName(data.username);
    if (existUser) {
      throw new SPError(
        SPErrorType.UserAlreadyExist,
        'User name already exist',
      );
    }

    data.password = await hashUtil.hashPassword(data.password);
    const user = await this.userRepository.createUser(currentUser, data);
    return user.id;
  }

  async updateUser(currentUser: User, id: number, data: UserUpdateModel) {
    await this.userRepository.updateUser(currentUser, id, data);
    this.delCache(id);
  }

  async deleteUser(currentUser: User, id: number) {
    await this.userRepository.deleteUser(id);
    this.delCache(id);
  }

  private delCache(id: number) {
    // 清除cache
    this.redisService.del(RedisKey.userCache + id);
  }

  async getFromCache(id: number): Promise<User> {
    const userRedisKey = RedisKey.userCache + id;
    const userJson = await this.redisService.get(userRedisKey);
    if (userJson) {
      return JSON.parse(userJson);
    }

    const userObj = await this.userRepository.findOne(id);
    if (userObj === null) {
      return null;
    }
    await this.redisService.set(
      userRedisKey,
      JSON.stringify(userObj),
      60 * 60 * 24,
    );
    return userObj;
  }

  async changePassword(
    currentUser: User,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne(currentUser.id);
    if (!user || !hashUtil.comparePasswords(user.password, oldPassword)) {
      throw new SPError(
        SPErrorType.OldPasswordIncorrect,
        'Old password incorrect',
      );
    }

    const hashedPassword = await hashUtil.hashPassword(newPassword);
    await this.userRepository.changePassword(
      currentUser,
      currentUser.id,
      hashedPassword,
    );
  }

  async resetUserPassword(currentUser: User, id: number, newPassword: string) {
    const hashedPassword = await hashUtil.hashPassword(newPassword);
    await this.userRepository.changePassword(currentUser, id, hashedPassword);
  }
}
