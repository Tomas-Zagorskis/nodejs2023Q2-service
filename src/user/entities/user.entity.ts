import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column({ default: 1 })
  version: number;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
