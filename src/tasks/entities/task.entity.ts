import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TaskType {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.TODO,
  })
  list: TaskType;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
