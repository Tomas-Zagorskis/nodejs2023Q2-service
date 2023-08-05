import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  login!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: 1 })
  version?: number;

  @Column('bigint')
  createdAt?: number;

  @Column('bigint')
  updatedAt?: number;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
