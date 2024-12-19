import { AppConfig } from './config.model';

export default (): AppConfig => ({
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASS || 'password',
    name: process.env.DATABASE_NAME || 'test_db',
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) || false,
    logging: Boolean(process.env.DATABASE_LOGGING) || false,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    keyPrefix: process.env.REDIS_KEY_PREFIX || '',
    bullKeyPrefix: process.env.REDIS_BULL_KEY_PREFIX || '',
  },
  file: {
    filePath: process.env.FILE_PATH || '',
  },
});
