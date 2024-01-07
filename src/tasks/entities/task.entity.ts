import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
