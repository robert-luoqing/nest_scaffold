import { ConfigService } from '../config/config.service';

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    const host = this.configService.redisConfig.host;
    const port = this.configService.redisConfig.port;
    const password = this.configService.redisConfig.password;
    const keyPrefix = this.configService.redisConfig.keyPrefix;
    this.redis = new Redis({
      host,
      port,
      password,
      keyPrefix,
    });
  }

  async set(
    key: string,
    value: string,
    expiryInSeconds?: number,
  ): Promise<string> {
    if (expiryInSeconds) {
      return this.redis.set(key, value, 'EX', expiryInSeconds);
    } else {
      return this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async hset(key: string, fieldId: string, value: string) {
    return await this.redis.hset(key, { [fieldId]: value });
  }

  async hget(key: string, fieldId: string) {
    return await this.redis.hget(key, fieldId);
  }

  /**
   * 注，这个是返回对象，而不是map
   * @param key
   * @returns
   */
  async hgetall<T>(key: string): Promise<T> {
    const result = await this.redis.hgetall(key);
    return result as T;
  }

  async lpush(key: string, value: string): Promise<number> {
    return await this.redis.lpush(key, value);
  }

  async rpush(key: string, value: string): Promise<number> {
    return await this.redis.rpush(key, value);
  }

  async getList(key: string): Promise<string[]> {
    const values = await this.redis.lrange(key, 0, -1);
    return values;
  }

  async lpop(listKey: string): Promise<string | null> {
    const value = await this.redis.lpop(listKey);
    return value;
  }

  // 从右侧弹出元素
  async rpop(listKey: string): Promise<string | null> {
    const value = await this.redis.rpop(listKey);
    return value;
  }
}
