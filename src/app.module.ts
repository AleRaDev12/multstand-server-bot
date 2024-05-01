import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { sessionMiddleware } from './middleware/session.middleware';
import { BotModule } from './bot/bot.module';
import { SeedService } from './seed.service';
import { Task } from './entities/tasks/task.entity';
import { ComponentsModule } from './entities/components/components.module';
import { Component } from './entities/components/component.entity';

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
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, Component]),
    BotModule,
  ],
  providers: [BotModule, SeedService],
})
export class AppModule {}
