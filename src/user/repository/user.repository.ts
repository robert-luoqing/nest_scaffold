import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateModel } from '../model/userCreate.model';
import { UserUpdateModel } from '../model/userUpdate.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  findOne(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findUsersByPage(
    page: number,
    limit: number,
  ): Promise<{ total: number; users: User[] }> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      users: items,
    };
  }

  async findByUserName(userName: string): Promise<User> {
    return await this.repository.findOneBy({ username: userName });
  }

  async createUser(currentUser: User, data: UserCreateModel): Promise<User> {
    const user = await this.repository.create({
      ...data,
      createdBy: currentUser.username,
      updatedBy: currentUser.username,
      createdTime: new Date(),
      updatedTime: new Date(),
    });
    await this.repository.save(user);
    return user;
  }

  async updateUser(currentUser: User, id: number, data: UserUpdateModel) {
    await this.repository.update(id, {
      role: data.role,
      desc: data.desc,
      permission: data.permission,
      updatedBy: currentUser.username,
      updatedTime: new Date(),
    });
  }

  async changePassword(currentUser: User, id: number, password: string) {
    await this.repository.update(id, {
      password,
      updatedBy: currentUser.username,
      updatedTime: new Date(),
    });
  }
  async deleteUser(id: number) {
    await this.repository.delete(id);
  }
}
