import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/v1/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/v1/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalTransformInterceptor } from './common/interceptors/global-transform.interceptor';
import { ListsModule } from './modules/v1/lists/lists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_URI'),
        };
      },
    }),
    UsersModule,
    AuthModule,
    ListsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalTransformInterceptor,
    },
  ],
})
export class AppModule {}
