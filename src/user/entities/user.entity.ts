import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  login!: string;

  @Column()
  password!: string;

  @Column({ default: 1 })
  version: number;

  @Column('bigint')
  createdAt: number;

  @Column('bigint')
  updatedAt: number;

  @Column({ nullable: true })
  refreshToken: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  toResponse() {
    const { id, login, version, createdAt, updatedAt } = this;

    return { id, login, version, createdAt: +createdAt, updatedAt: +updatedAt };
  }
}
