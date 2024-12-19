## Database
- https://typeorm.io/
- Raw Query
  https://typeorm.io/select-query-builder

```sql
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async executeRawSql() {
    const sql = 'SELECT * FROM users WHERE age > :age';
    const age = 18;

    const users = await this.entityManager.query(sql, { age });
    return users;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  async executeRawSql() {
    const sql = 'SELECT * FROM users WHERE age > :age';
    const age = 18;

    const users = await this.connection.query(sql, { age });
    return users;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUsersAboveAge(age: number) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.age > :age', { age })
      .getMany();

    return users;
  }
}
```

# Global auth
# Redis
# Schedule Task
ExampleService

# Docker package
```
docker build -t nest-scaffold .
```

# Docker
```
// server
docker run -d --name nest-scaffold -p 3020:3020 --restart=always --link mysql:mysql --link redis:redis nest-scaffold

// local
docker run -d --name nest-scaffold -p 3021:3020 --restart=always --link my_sql:mysql --link redis:redis nest-scaffold
```

# Docker build and run
```
docker-compose up --build
```

# package with docker-compose。
1. build with docker-compose to generate image
```
docker-compose build 
```
2. Run container with
```
docker-compose up 
``
For to generate image and container:
```
docker-compose up --build 
```
The old image will stop automatically and rebuild new image and container

# Deploy
docker run -d --name redis -p 16379:6379 --restart=always redis
docker run -d --name mysql -p 33063:3306 --restart=always -v /data/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=pwd docker.m.daocloud.io/library/mysql:8.0.32 --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --explicit_defaults_for_timestamp=true --lower_case_table_names=1


