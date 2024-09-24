import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './entities/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { SceneRoleGuard } from './bot/guards/scene-role.guard';
import { sessionMiddleware } from './bot/middleware/session.middleware';
import { Task } from './entities/works/tasks/task.entity';
import { Component } from './entities/parts/component/component.entity';

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
      database: 'db/database.sqlite',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/**/*.js'],
      migrationsRun: false,
    }),
    TypeOrmModule.forFeature([Task, Component]),
    BotModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SceneRoleGuard,
    },
  ],
})
export class AppModule {}
