import { SceneRoleGuard } from './bot/guards/scene-role.guard';
import { sessionMiddleware } from './middleware/session.middleware';
import { Task } from './entities/tasks/task.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/parts/component/component.entity';
import { UserModule } from './entities/user/user.module';
import { SeedService } from './seed.service';
import { APP_GUARD } from '@nestjs/core';

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
