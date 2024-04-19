import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/tasks/task.entity';

const BaseTasks: Omit<Task, 'id'>[] = [
  {
    category: '',
    name: 'acceptMill',
    shownName: 'Принять партию с фрезеровки',
    duration: 15,
    cost: 50,
  },
  {
    name: 'checkMill',
    category: '',
    shownName: 'Проверить станок из фрезеровки',
    duration: 15,
    cost: 50,
  },
  {
    name: 'prepPaint',
    category: '',
    shownName: 'Подготовить станок в покраску',
    duration: 15,
    cost: 50,
  },
  {
    name: 'sendPaint',
    category: '',
    shownName: 'Отправить партию в покраску',
    duration: 15,
    cost: 50,
  },
  {
    name: 'acceptPaint',
    category: '',
    shownName: 'Принять партию с покраски',
    duration: 15,
    cost: 50,
  },
  {
    name: 'checkPaint',
    category: '',
    shownName: 'Проверить станок с покраски',
    duration: 15,
    cost: 50,
  },
  {
    name: 'nutsDrill',
    category: '',
    shownName: 'Гайки: отверстия засверлить',
    duration: 1.2,
    cost: 4,
  },
  {
    name: 'nutsInsert',
    category: '',
    shownName: 'Гайки: вставить',
    duration: 0.5,
    cost: 1.5,
  },
  {
    name: 'glassFetch',
    category: '',
    shownName: 'Стекло: забрать с магазина',
    duration: 45,
    cost: 150,
  },
  {
    name: 'glassGlue',
    category: '',
    shownName: 'Стекло: вклеить',
    duration: 40,
    cost: 135,
  },
  {
    name: 'glassCutSealant',
    category: '',
    shownName: 'Стекло: срезать герметик',
    duration: 20,
    cost: 65,
  },
  {
    category: '',
    name: 'ledSolder',
    shownName: 'LED: коннектор припаять',
    duration: 10,
    cost: 35,
  },
  {
    name: 'led2D',
    category: '',
    shownName: 'LED: 2D: пластик прикрутить, ленту установить',
    duration: 30,
    cost: 100,
  },
  {
    name: 'led3D',
    category: '',
    shownName: 'LED: 3D: пластик прикрутить, ленту установить',
    duration: 60,
    cost: 200,
  },
  {
    name: 'ledDimmer',
    category: '',
    shownName: 'LED: Регулятор яркости изготовить',
    duration: 20,
    cost: 65,
  },
  {
    name: 'connectorBase',
    category: '',
    shownName: 'Коннектор: установить в основание',
    duration: 10,
    cost: 35,
  },
  {
    category: '',
    name: 'packTM',
    shownName: 'Отправка: TM: собрать',
    duration: 20,
    cost: 65,
  },
  {
    name: 'packTL',
    category: '',
    shownName: 'Отправка: TL: собрать',
    duration: 20,
    cost: 65,
  },
  {
    name: 'pack3D',
    category: '',
    shownName: 'Отправка: 3D: собрать',
    duration: 20,
    cost: 65,
  },
  {
    category: '',
    name: 'packTLite',
    shownName: 'Отправка: TLite: собрать',
    duration: 20,
    cost: 65,
  },
  {
    name: 'shipCheck',
    category: '',

    shownName: 'Отправка: проверить, сфотографировать, отправить фото',
    duration: 20,
    cost: 70,
  },
  {
    name: 'shipDisassemble',
    category: '',
    shownName: 'Отправка: разобрать',
    duration: 20,
    cost: 65,
  },
  {
    name: 'shipPackTM_TL',
    category: '',

    shownName: 'Отправка: упаковать станок TM/TL',
    duration: 100,
    cost: 330,
  },
  {
    name: 'shipPackLite',
    category: '',

    shownName: 'Отправка: упаковать станок Lite',
    duration: 40,
    cost: 135,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async onModuleInit() {
    await this.seedTasks();
  }

  private async seedTasks() {
    // Добавление задач в базу данных, если они еще не добавлены
    for (const task of BaseTasks) {
      const dbTask = await this.taskRepository.findOneBy({
        name: task.name,
      });
      if (!dbTask) {
        await this.taskRepository.save(task);
      }
    }

    console.log('Seeding tasks completed');
  }
}
