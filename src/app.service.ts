import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  private readonly logger = new Logger('Database');
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      this.logSuccess();
    } else {
      this.connection.on('connected', () => this.logSuccess());
    }
  }

  private logSuccess() {
    this.logger.log('✅ MongoDB connection successful');
    this.logger.log(`📁 Database Name: ${this.connection.name}`);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
