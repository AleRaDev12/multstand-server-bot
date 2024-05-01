import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from '../../helpers';
import { LedStripModel, Painting, StandModel, Tripod } from '../unions';
import { CustomWizardContext } from '../../shared/interfaces';
import { StandProd } from './stand-prod.entity';
import { SCENES } from '../../shared/wizards';

const standProdSteps: WizardStepType[] = [
  { message: 'Модель:', field: 'model', union: StandModel, type: 'union' },
  {
    message: 'Покраска:',
    field: 'painting',
    union: Painting,
    type: 'union',
  },
  {
    message: 'Количество обычных стёкол:',
    field: 'glassesRegular',
    type: 'number',
  },
  {
    message: 'Количество стёкол пп:',
    field: 'glassesHighTransparency',
    type: 'number',
  },
  {
    message: 'Светодиодная лента:',
    field: 'ledStripModel',
    union: LedStripModel,
    type: 'union',
  },
  { message: 'Ткань для затенения:', field: 'shadingFabric', type: 'number' },
  {
    message: 'Штатив для объёмной анимации:',
    field: 'tripod',
    type: 'union',
    union: Tripod,
  },
];

const steps = standProdSteps;

const getEntity = (ctx: CustomWizardContext): StandProd =>
  ctx.wizard.state.standProd;
const setEntity = (ctx: CustomWizardContext): void => {
  ctx.wizard.state.standProd = new StandProd();
};
const save = function (entity: StandProd) {
  return this.service.create(entity);
};
const print = (ctx: CustomWizardContext, entity: StandProd) =>
  ctx.reply(
    `Набор характеристик станка ${JSON.stringify(entity, null, 2)} добавлен`,
  );

export function UnifiedWizardHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value = async function (ctx: CustomWizardContext) {
      console.log('*-* -------------------');
      console.log('*-* stepIndex', stepIndex);

      const entity = getEntity(ctx);

      if (stepIndex === 1) {
        setEntity(ctx);
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
            const optionNumber = +msg.text;
            const unionKeys = Object.keys(stepAnswer.union);
            if (optionNumber < 1 || optionNumber > unionKeys.length) {
              return 'Некорректное значение. Пожалуйста, введите значение еще раз.';
            }
            entity[stepAnswer.field] = getValueUnionByIndex(
              stepAnswer.union,
              optionNumber - 1,
            );

            break;
          case 'number':
            const number = parseFloat(msg.text);
            if (!isNaN(number)) {
              entity[stepAnswer.field] = number;
            } else {
              return 'Введите корректное числовое значение.';
            }
            break;
          case 'boolean':
            const value = msg.text.toLowerCase();
            let booleanValue: boolean;

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
            entity[stepAnswer.field] = booleanValue;
            break;
          default:
            return 'Ошибка';
        }

        const isLastStep = stepForAnswerNumber === steps.length - 1;
        if (isLastStep) {
          console.log('*-* entity', entity);
          const creatingEntity = await save.bind(this)(entity);
          await print(ctx, creatingEntity);

          await ctx.scene.leave();
          await ctx.scene.enter(SCENES.ENTERING);
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
