import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import type { Role } from '../types/role.type';
import { News } from '../../news/entities/news.entity';

@Entity('users')
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  // TODO: When switching from the UPN to the ID to create database users, make this the primary column again
  //@PrimaryColumn({ type: 'varchar', length: 36, unique: true })
  @Column({ type: 'varchar', length: 36, nullable: true })
  id?: string;

  @PrimaryColumn({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @DeleteDateColumn()
  disabledAt?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  lastLogin?: Date;

  @Column({ default: 'GUEST' })
  userRole: Role;

  // TODO: This should be it's own entity with group types ('class', 'staff', ...)
  @Column({ nullable: true })
  group?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  @OneToMany(() => News, (news) => news.user)
  news: News[];

  toPublic() {
    return {
      id: this.id ?? null,
      email: this.email,
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      group: this.group ?? null,
      lastLogin: this.lastLogin ? this.lastLogin.toISOString() : null,
      userRole: this.userRole,
      disabledAt: this.disabledAt ?? null,
    };
  }

  toPublicRestricted() {
    return {
      id: this.id ?? null,
      email: this.email,
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      group: this.group ?? null,
    };
  }
}
