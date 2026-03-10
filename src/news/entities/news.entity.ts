import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('news')
export class News {
  constructor(partial?: Partial<News>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'timestamp without time zone', default: 'now()' })
  lastRevision: Date;

  @Column({ type: 'text', nullable: true })
  modificationsRequested?: string | null;

  @Column({ type: 'varchar', length: 512 })
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.news)
  user: User;

  toPublic() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      lastRevision: this.lastRevision,
      publishedAt: this.publishedAt ?? null,
      modificationsRequested: this.modificationsRequested ?? null,
      user: this.user?.toPublicRestricted(),
    };
  }
}
