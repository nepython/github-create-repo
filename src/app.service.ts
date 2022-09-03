import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return '<a href="">Continue with Github</a>';
  }
}
