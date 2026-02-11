import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 36, unique: true })
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @DeleteDateColumn()
  disabledAt?: Date;

  @Column({ type: 'timestamp without time zone' })
  lastLogin: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;
}
