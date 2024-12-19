import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' }) // 数据库表名
export class User {
  @PrimaryGeneratedColumn({ type: 'int' }) // 自动生成主键
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  role?: string;

  @Column({
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: 'json, like [1,3,4,5], 只记录有权限的',
  })
  permission?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  desc?: string;

  @Column({ name: 'created_time', type: 'timestamp' })
  createdTime: Date;

  @Column({ name: 'updated_time', type: 'timestamp' })
  updatedTime: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', length: 100, nullable: true })
  updatedBy: string;
}
