import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MyJwtService {
  constructor(private jwtService: JwtService) {}

  /**
   * expiresIn为
   * '1d' - 1 天
   * '12h' - 12 小时
   * '30m' - 30 分钟
   */
  async signAsync(obj: object, expiresIn?: string): Promise<string> {
    const signObj = {
      issueTime: new Date().getTime(),
      user: { ...obj },
    };
    return await this.jwtService.signAsync(signObj, {
      expiresIn: expiresIn || '7d',
    });
  }
}
