import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from '../../helpers';
import { Led, Painting, StandModel, Tripod } from '../unions';
import { CustomWizardContext } from '../../shared/interfaces';
import { StandOrder } from './stand-order.entity';

const commonSteps: WizardStepType[] = [
  { message: 'Выберите заказ:', type: 'orderSelect' },
  { message: 'Модель:', field: 'model', type: 'union', union: StandModel },
  {
    message: 'Тип обработки:',
    field: 'painting',
    type: 'union',
    union: Painting,
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
    field: 'glassesRegular',
    type: 'number',
  },
  {
    message: 'Количество стёкол повышенной прозрачности:',
    field: 'glassesHighTransparency',
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

export const standOrdersSteps: WizardStepType[] = commonSteps;

export function StandOrderWizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value = async function (ctx: CustomWizardContext) {
      console.log('*-* -------------------');
      console.log('*-* stepIndex', stepIndex);

      if (stepIndex === 1) {
        ctx.wizard.state.standSet = new StandOrder();
      }

      const stepForAnswerNumber = stepIndex - 2;
      const stepForRequestNumber = stepIndex - 1;

      const stepAnswer = standOrdersSteps[stepForAnswerNumber];
      const stepRequest = standOrdersSteps[stepForRequestNumber];
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
            const optionNumber = +msg.text;
            const unionKeys = Object.keys(stepAnswer.union);
            if (optionNumber < 1 || optionNumber > unionKeys.length) {
              return 'Некорректное значение. Пожалуйста, введите значение еще раз.';
            }
            ctx.wizard.state.standSet[stepAnswer.field] = getValueUnionByIndex(
              stepAnswer.union,
              optionNumber - 1,
            );

            if (stepAnswer.field === 'model') {
              switch (ctx.wizard.state.standSet.model) {
                case StandModel.mTM15:
                case StandModel.mTL15:
                  standOrdersSteps.push(...tmtlSteps);
                  break;
                case StandModel.m3DM5:
                case StandModel.m3DL5:
                  standOrdersSteps.push(...threeDSteps);
                  break;
              }
            }
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
            let booleanValue;

            switch (value) {
              case 'да':
              case 'yes':
              case '1':
                booleanValue = true;
                break;
              case 'нет':
              case 'no':
              case '0':
                booleanValue = false;
                break;

              default:
                return `Введеите "да", "нет", "yes", "no", 1 или 0.`;
            }
            ctx.wizard.state.standSet[stepAnswer.field] = booleanValue;
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

        const isLastStep = stepForAnswerNumber === standOrdersSteps.length - 1;
        if (isLastStep) {
          console.log(
            '*-* ctx.wizard.state.standSet',
            ctx.wizard.state.standSet,
          );
          const standSet = await this.standSetsService.create(
            ctx.wizard.state.standSet,
          );

          // Reset steps for next iterations
          standOrdersSteps.length = 0;
          standOrdersSteps.push(...commonSteps);

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
            return `${standOrdersSteps[stepIndex - 1].message}\n${await this.orderService.getList()}`;
          }

          default: {
            console.log('*-* default');
            break;
          }
        }

        ctx.wizard.next();
        return generateMessage(standOrdersSteps[stepIndex - 1]);
      }
    };

    return descriptor;
  };
}
