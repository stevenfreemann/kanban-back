import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: RegisterAuthDto) {
    try {
      const { password } = user;
      const encryptPass = await hash(password, 8);
      user = { ...user, password: encryptPass };

      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
      throw error;
    }
  }

  async login(user: LoginAuthDto) {
    const { email, password } = user;
    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser) throw new HttpException('Usuario no encontrado', 404);
    const validatePass = await compare(password, findUser.password);
    if (!validatePass) throw new HttpException('Password incorrecto', 401);
    return findUser;
  }
  /* create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  } */
}
