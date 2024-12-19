import { AuthModule } from './../common/auth/auth.module';
import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController, AuthController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
