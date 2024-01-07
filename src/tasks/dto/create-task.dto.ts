import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TaskType } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  @IsEnum(TaskType)
  list: TaskType;
}
