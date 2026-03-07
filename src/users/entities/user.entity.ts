import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';
import type { Role } from '../types/role.type';

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  toPublic() {
    return {
      id: this.id ?? null,
      email: this.email,
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      lastLogin: this.lastLogin ? this.lastLogin.toISOString() : null,
      userRole: this.userRole,
      disabledAt: this.disabledAt ?? null,
    };
  }
}
