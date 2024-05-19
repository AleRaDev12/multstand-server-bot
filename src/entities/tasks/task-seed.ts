import { Task } from './task.entity';

export const seedTasks: Omit<Task, 'id'>[] = [
  // Решил удалить
  // {
  //   category: '',
  //   name: 'acceptMill',
  //   shownName: 'Принять партию с фрезеровки',
  //   duration: 15,
  //   cost: 50,
  // },
  {
    name: 'frez',
    category: '',
    shownName: 'Заказать фрезеровку',
    // Связь со стнком-изделием: да (несколько)
    //
    // Описание задачи: изгогтовить макет с деталями на фрезеровку, отправить заказ
    //
    // Что вносится: станки-изделия (номера, тип), комплектующие-рамки/стенки,
    // длина реза, количество листов фанеры
    //
    // Категория расход компонентов: фрезеровка
    //
    // Это момент добавления новых stand prod
    //
    // Если помимо основных деталей добавляются ещё дополнительные, резервные
    // - их длина реза тоже указывается - отдельно суммой
    duration: 15,
    cost: 50,
  },
  {
    name: 'checkMill',
    category: '',
    shownName: 'Проверить станок из фрезеровки',
    // Связь со станком-изделием: да
    //
    // Описание задачи: Проверить качество фрезеровки, наличие всех деталей, упаковать в плёнку, обозначить номер stand prod, приклеить наклейку с номером
    // Если пришёл не целый станок, то при создании в коментарии указать,
    // каких деталей не вхатает
    duration: 15,
    cost: 50,
  },
  {
    name: 'prepPaint',
    category: '',
    shownName: 'Подготовить станок в покраску',
    // Связь со стнком-изделием: да
    //
    // Описание задачи: Соединить комплект-базу с комплектом-рамками/стенками, склеить, приклеить наклейку,
    // написать номер изделия, номер заказа (если есть), тип обработки
    //
    // Доп задача: Обновить станок-изделие (добавить рамки)
    duration: 15,
    cost: 50,
  },
  {
    name: 'sendPaint',
    category: '',
    shownName: 'Отправить партию в покраску',
    // Связь со стнком-изделием: нет
    //
    // Доп задача: -
    duration: 15,
    cost: 50,
  },
  {
    name: 'acceptPaint',
    category: '',
    shownName: 'Принять партию с покраски',
    // Связь со стнком-изделием: нет
    //
    // Доп задача: -
    duration: 15,
    cost: 50,
  },
  {
    name: 'checkPaint',
    category: '',
    shownName: 'Проверить обработку (покраску) станка',
    // Связь со стнком-изделием: да
    // Описание задачи: Распаковать комплект, проверить качество покраски,
    // отправить в чат фото и описание дефектов
    //
    //
    // Доп задача: -
    duration: 15,
    cost: 50,
  },
  {
    name: 'nutsDrill',
    category: '',
    shownName: 'Гайки: отверстия засверлить',
    //
    //
    // Доп задача: -
    // Категория расход компонентов:
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
