import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { fromValue, toKey } from '../../helpers';

const BaseTasks = {
  acceptMill: { name: 'Принять партию с фрезеровки', duration: 15, cost: 50 },
  checkMill: { name: 'Проверить станок из фрезеровки', duration: 15, cost: 50 },
  prepPaint: { name: 'Подготовить станок в покраску', duration: 15, cost: 50 },
  sendPaint: { name: 'Отправить партию в покраску', duration: 15, cost: 50 },
  acceptPaint: { name: 'Принять партию с покраски', duration: 15, cost: 50 },
  checkPaint: { name: 'Проверить станок с покраски', duration: 15, cost: 50 },
  nutsDrill: { name: 'Гайки: отверстия засверлить', duration: 1.2, cost: 4 },
  nutsInsert: { name: 'Гайки: вставить', duration: 0.5, cost: 1.5 },
  glassFetch: { name: 'Стекло: забрать с магазина', duration: 45, cost: 150 },
  glassGlue: { name: 'Стекло: вклеить', duration: 40, cost: 135 },
  glassCutSealant: { name: 'Стекло: срезать герметик', duration: 20, cost: 65 },
  ledSolder: { name: 'LED: коннектор припаять', duration: 10, cost: 35 },
  led2D: {
    name: 'LED: 2D: пластик прикрутить, ленту установить',
    duration: 30,
    cost: 100,
  },
  led3D: {
    name: 'LED: 3D: пластик прикрутить, ленту установить',
    duration: 60,
    cost: 200,
  },
  ledDimmer: {
    name: 'LED: Регулятор яркости изготовить',
    duration: 20,
    cost: 65,
  },
  connectorBase: {
    name: 'Коннектор: установить в основание',
    duration: 10,
    cost: 35,
  },
  packTM: { name: 'Отправка: TM: собрать', duration: 20, cost: 65 },
  packTL: { name: 'Отправка: TL: собрать', duration: 20, cost: 65 },
  pack3D: { name: 'Отправка: 3D: собрать', duration: 20, cost: 65 },
  packTLite: { name: 'Отправка: TLite: собрать', duration: 20, cost: 65 },
  shipCheck: {
    name: 'Отправка: проверить, сфотографировать, отправить фото',
    duration: 20,
    cost: 70,
  },
  shipDisassemble: { name: 'Отправка: разобрать', duration: 20, cost: 65 },
  shipPackTM_TL: {
    name: 'Отправка: упаковать станок TM/TL',
    duration: 100,
    cost: 330,
  },
  shipPackLite: {
    name: 'Отправка: упаковать станок Lite',
    duration: 40,
    cost: 135,
  },
};

export const Tasks = Object.keys(BaseTasks).reduce((acc, key) => {
  console.log('*-* key', key);
  acc[key] = BaseTasks[key].name;
  return acc;
}, {});

type TasksType = (typeof Tasks)[keyof typeof Tasks];

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    transformer: {
      to: toKey(Tasks),
      from: fromValue(Tasks),
    },
  })
  task: TasksType;

  @Column({
    type: 'date',
  })
  date: Date;

  // @Column({
  //   type: 'date',
  // })
  // dateOfReport: Date;

  // @Column({
  //   type: 'date',
  //   nullable: true,
  //   // transformer: {
  //   //   to: toKey(StandModel),
  //   //   from: fromValue(StandModel),
  //   // },
  // })
  // dateArrival: Date;
  //
  // @Column({
  //   type: 'int',
  //   // transformer: {
  //   //   to: toKey(StandModel),
  //   //   from: fromValue(StandModel),
  //   // },
  // })
  // amount: number;
  //
  // @Column({
  //   type: 'int',
  //   // transformer: {
  //   //   to: toKey(StandModel),
  //   //   from: fromValue(StandModel),
  //   // },
  // })
  // count: number;
}
