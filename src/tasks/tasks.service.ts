import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    console.log('user', userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    console.log('user :>> ', user);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const newTask = await this.taskRepository.create({
      ...createTaskDto,
      user,
    });
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async findAll(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tasks'],
    });
    const tasks = user.tasks;
    // Si el usuario no existe, lanza una excepción
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);

    await this.taskRepository.save(task);

    return task;
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
