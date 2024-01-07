import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUsers(): string[] {
    return ['hola1', 'hola2'];
  }

  getHello(): string {
    return 'Hello World!';
  }
}
