import { Module, Global } from '@nestjs/common';
import { JWT_SECRET } from '../decorator/tokenHandler';
import { JwtModule } from '@nestjs/jwt';
import { MyAuthGuard } from './auth.guard';
import { MyJwtService } from './myjwt.service';

@Global()
@Module({
  imports: [JwtModule.register({ secret: JWT_SECRET })],
  providers: [MyAuthGuard, MyJwtService],
  exports: [MyAuthGuard, MyJwtService],
})
export class AuthModule {}
