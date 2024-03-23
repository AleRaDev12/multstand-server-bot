import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  getValueByIndex,
  PaintingType,
  printEnum,
  Stand,
  StandModel,
} from './stand.entity';
import { StandsService } from './stands.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards'; // Новый импорт

interface WizardStep {
  message: string;
  field: keyof Stand;
  enum?: object;
}

const steps: WizardStep[] = [
  { message: 'Модель:', field: 'model', enum: StandModel },
  { message: 'Покраска:', field: 'painting', enum: PaintingType },
  { message: 'Количество обычных стёкол:', field: 'glassesRegular' },
];

function generateMessage(step: WizardStep): string {
  return step.enum ? `${step.message}\n${printEnum(step.enum)}` : step.message;
}

function WizardStepHandler(stepIndex: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // const originalMethod = descriptor.value;

    descriptor.value = async function (
      ctx: CustomWizardContext,
      ...args
      // msg: { text: string },
    ) {
      const { message: msg } = ctx;

      const step = steps[stepIndex];
      console.log('*-* step', step);
      console.log('*-* msg', msg);
      console.log('*-* msg json', JSON.stringify(msg, null, 2));

      if (step.enum) {
        if (msg.text !== undefined) {
          ctx.wizard.state.stand[step.field] = getValueByIndex(
            step.enum,
            +msg.text - 1,
          );
        } else {
          // Обработка случая, когда msg.text равно undefined
          // Например, отправка сообщения об ошибке и повторный запрос значения
          return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
        }
      } else {
        if (msg.text !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          ctx.wizard.state.stand[step.field] = +msg.text;
        } else {
          // Обработка случая, когда msg.text равно undefined
          return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
        }
      }

      if (stepIndex === steps.length - 1) {
        const stand = await this.usersService.create(ctx.wizard.state.stand);
        await ctx.scene.leave();
        return `Станок ${JSON.stringify(stand, null, 2)} добавлен`;
      } else {
        ctx.wizard.next();
        return generateMessage(steps[stepIndex + 1]);
      }
    };

    return descriptor;
  };
}

@Wizard(WIZARDS.ADD_STAND_WIZARD_ID)
export class StandAddWizard {
  constructor(
    @Inject(StandsService)
    private readonly usersService: StandsService,
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.stand = new Stand();
    ctx.wizard.next();
    return generateMessage(steps[0]);
  }

  @On('text')
  @WizardStep(2)
  @WizardStepHandler(0)
  async step1() {}

  @On('text')
  @WizardStep(3)
  @WizardStepHandler(1)
  async step2() {}

  @On('text')
  @WizardStep(4)
  @WizardStepHandler(2)
  async last() {}
}
