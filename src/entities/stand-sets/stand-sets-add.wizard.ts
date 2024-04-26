import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Led, Processing, StandSet, Tripod } from './stand-set.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from '../../helpers';
import { StandSetsService } from './stand-sets.service';
import { StandModel } from '../stands/stand.entity';
import { TasksService } from '../tasks/tasks.service';
import { OrdersService } from '../orders/orders.service';

const commonSteps: WizardStepType[] = [
  { message: 'Выберите заказ:', type: 'orderSelect' },
  { message: 'Модель:', field: 'model', type: 'union', union: StandModel },
  {
    message: 'Тип обработки:',
    field: 'processing',
    type: 'union',
    union: { ...Processing },
  },
  {
    message: 'Крепление для смартфона (количество):',
    field: 'smartphoneMount',
    type: 'number',
  },
  {
    message: 'Штатив для объёмной анимации:',
    field: 'tripod',
    type: 'union',
    union: { ...Tripod },
  },
  {
    message: 'Тип светодиодной ленты:',
    field: 'ledType',
    type: 'union',
    union: { ...Led },
  },
];

const tmtlSteps: WizardStepType[] = [
  {
    message: 'Количество стёкол обычных:',
    field: 'regularGlass',
    type: 'number',
  },
  {
    message: 'Количество стёкол повышенной прозрачности:',
    field: 'highTransparencyGlass',
    type: 'number',
  },
  {
    message: 'Количество регуляторов яркости:',
    field: 'dimmersCount',
    type: 'number',
  },
  {
    message: 'Наличие ткани для затенения (да/нет):',
    field: 'shadingFabric',
    type: 'boolean',
  },
];

const threeDSteps: WizardStepType[] = [
  {
    message: 'Количество боковых стенок:',
    field: 'sideWallsCount',
    type: 'number',
  },
  {
    message: 'Количество поворотных механизмов:',
    field: 'rotaryMechanismsCount',
    type: 'number',
  },
];

const steps: WizardStepType[] = commonSteps;

function WizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value = async function (ctx: CustomWizardContext) {
      console.log('*-* -------------------');
      console.log('*-* stepIndex', stepIndex);

      if (stepIndex === 1) {
        ctx.wizard.state.standSet = new StandSet();
      }

      const stepForAnswerNumber = stepIndex - 2;
      const stepForRequestNumber = stepIndex - 1;

      const stepAnswer = steps[stepForAnswerNumber];
      const stepRequest = steps[stepForRequestNumber];
      console.log('*-* stepAnswer', stepAnswer);
      console.log('*-* stepRequest', stepRequest);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = ctx.update?.message;

      const isAwaitAnswer = !!stepAnswer;

      if (isAwaitAnswer) {
        // Handle answer
        console.log('*-* handle answer');
        if (!msg?.text) {
          return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
        }

        switch (stepAnswer.type) {
          case 'union':
            ctx.wizard.state.standSet[stepAnswer.field] = getValueUnionByIndex(
              stepAnswer.union,
              +msg.text - 1,
            );
            break;
          case 'number':
            const number = parseFloat(msg.text);
            if (!isNaN(number)) {
              ctx.wizard.state.standSet[stepAnswer.field] = number;
            } else {
              return 'Введите корректное числовое значение.';
            }
            break;
          case 'boolean':
            const value = msg.text.toLowerCase();
            if (value === 'да' || value === 'yes') {
              ctx.wizard.state.standSet[stepAnswer.field] = true;
            } else if (value === 'нет' || value === 'no') {
              ctx.wizard.state.standSet[stepAnswer.field] = false;
            } else {
              return 'Введите "да" или "нет".';
            }
            break;
          case 'orderSelect':
            console.log('*-* orderSelect');
            console.log('*-* msg.text', msg.text);
            const selectedIndex = parseInt(msg.text) - 1;
            console.log('*-* selectedIndex', selectedIndex);

            const orders = await this.orderService.findAll();
            console.log('*-* orders --------', orders);

            const order = orders[selectedIndex];
            console.log('*-* order --------', order);

            if (selectedIndex >= 0 && selectedIndex < orders.length) {
              ctx.wizard.state.standSet.order = order;
              console.log(
                '*-* ctx.wizard.state.standSet',
                ctx.wizard.state.standSet,
              );
            } else {
              return 'Выберите действительный номер заказа из списка.';
            }
            break;

          default:
            return 'Ошибка';
        }

        const isLastStep = stepForAnswerNumber === steps.length - 1;
        if (isLastStep) {
          console.log(
            '*-* ctx.wizard.state.standSet',
            ctx.wizard.state.standSet,
          );
          const standSet = await this.standSetsService.create(
            ctx.wizard.state.standSet,
          );
          await ctx.scene.leave();
          return `Набор характеристик станка ${JSON.stringify(standSet, null, 2)} добавлен`;
        }
      }

      const isShouldSendRequest = !!stepRequest;

      if (isShouldSendRequest) {
        // Send text
        console.log('*-* send text');

        switch (stepRequest.type) {
          case 'orderSelect': {
            const ordersLint = await this.orderService.getList();
            console.log('*-* ordersLint', ordersLint);

            ctx.wizard.next();
            return `${steps[stepIndex - 1].message}\n${await this.orderService.getList()}`;
          }

          default: {
            console.log('*-* default');
            break;
          }
        }

        ctx.wizard.next();
        return generateMessage(steps[stepIndex - 1]);
      }
    };

    return descriptor;
  };
}

@Wizard(WIZARDS.ADD_STAND_SET_WIZARD_ID)
export class StandSetsAddWizard {
  constructor(
    @Inject(StandSetsService)
    private readonly standSetsService: StandSetsService,
    @Inject(OrdersService)
    private readonly orderService: OrdersService,
  ) {}

  @WizardStep(1)
  @WizardStepHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @WizardStepHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  async step3(@Ctx() ctx: CustomWizardContext): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const msg = ctx.update?.message;
    if (!msg?.text) {
      return 'Некорректный ввод. Пожалуйста, введите модель станка.';
    }

    ctx.wizard.state.standSet.model = getValueUnionByIndex(
      steps[0].union,
      +msg.text - 1,
    );

    switch (ctx.wizard.state.standSet.model) {
      case StandModel.mTM15:
      case StandModel.mTL15:
        steps.push(...tmtlSteps);
        break;
      case StandModel.m3DM5:
      case StandModel.m3DL5:
        steps.push(...threeDSteps);
        break;
    }

    ctx.wizard.next();
    return generateMessage(steps[2]);
  }

  @On('text')
  @WizardStep(4)
  @WizardStepHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @WizardStepHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @WizardStepHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @WizardStepHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @WizardStepHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @WizardStepHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @WizardStepHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @WizardStepHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @WizardStepHandler(12)
  async step12() {}
}
