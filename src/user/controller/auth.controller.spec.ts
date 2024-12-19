import { ConfigModule } from './../../common/config/config.module';
import { AuthModule } from './../../common/auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { AppModule } from '../../app/app.module';

describe('AuthController', () => {
  // let authController: AuthController;
  let userController: UserController;
  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        AppModule,
        AuthModule,
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UserController, AuthController],
      providers: [UserRepository, UserService],
    }).compile();

    // authController = app.get<AuthController>(AuthController);
    userController = app.get<UserController>(UserController);
  });
  beforeEach(async () => {});

  describe('User Auth', () => {
    it('Create new user"', async () => {
      const currentUser = new User();
      currentUser.id = 1;
      currentUser.username = 'robert';
      await userController.createUser(currentUser, {
        username: 'dddd',
        password: 'DdddAmz$168',
      });
      const result = await userController.createUser(currentUser, {
        username: 'robert',
        password: 'lq0001LQ',
      });
      console.log(JSON.stringify(result));
    });
    // it('Login test"', async () => {
    //   const result = await authController.login({
    //     userName: 'robert',
    //     password: '123456',
    //   });
    //   expect(result?.user.id).toBe(12);
    // });
  });
});
