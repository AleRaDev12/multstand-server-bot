import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { sessionMiddleware } from './middleware/session.middleware';
import { BotModule } from './bot/bot.module';
import { SeedService } from './seed.service';
import { Task } from './entities/tasks/task.entity';
import { Component } from './entities/component/component/component.entity';
import { UserModule } from './entities/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { SceneRoleGuard } from './bot/guards/scene-role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [sessionMiddleware],
      include: [BotModule],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/**/*.js'],
      migrationsRun: false,
    }),
    TypeOrmModule.forFeature([Task, Component]),
    BotModule,
    UserModule,
  ],
  providers: [
    SeedService,
    {
      provide: APP_GUARD,
      useClass: SceneRoleGuard,
    },
  ],
})
export class AppModule {}
