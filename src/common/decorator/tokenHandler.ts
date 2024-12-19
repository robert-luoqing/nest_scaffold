import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entity/user.entity';

export const JWT_SECRET = 'AE2DGHRTEDFSAEWRWETWERFSDAFSDGR';

let jwtServiceInstance: JwtService | null = null;
const getJwtService = () => {
  if (!jwtServiceInstance) {
    jwtServiceInstance = new JwtService({ secret: JWT_SECRET });
  }

  return jwtServiceInstance;
};

export const getUserFromToken = (request: any): User => {
  if (request.currentUser) {
    return request.currentUser;
  }

  const token = request.headers['token'] || request.query?.token;
  if (token) {
    try {
      const payload = getJwtService().verify(token);
      request.currentUser = payload.user;
      return payload.user;
    } catch (ex) {
      console.error('parse token error', ex);
    }
  }

  return null;
};
