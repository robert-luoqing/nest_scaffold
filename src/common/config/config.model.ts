export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  logging: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  keyPrefix: string;
  bullKeyPrefix: string;
}

export interface FileConfig {
  filePath: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  redis: RedisConfig;
  file: FileConfig;
}
