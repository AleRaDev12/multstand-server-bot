import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { StandsService } from './stands.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import {
  generateMessage,
  getValueByIndex,
  WizardStepType,
} from '../../helpers';
import { LedStripType, Painting, StandModel } from '../unions';
import { Stand } from './stand.entity';

const steps: WizardStepType[] = [
  { message: 'Модель:', field: 'model', enum: StandModel, type: 'union' },
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
    enum: LedStripType,
    type: 'union',
  },
  { message: 'Ткань для затенения:', field: 'shadingFabric', type: 'number' },
  { message: 'Штатив для объёмной анимации:', field: 'tripod', type: 'number' },
];

function WizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // const originalMethod = descriptor.value;

    const stepIndexCorrected = stepIndex - 2;

    descriptor.value = async function (ctx: CustomWizardContext) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = ctx.update?.message;
      const step = steps[stepIndexCorrected];

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
          ctx.wizard.state.stand[step.field] = +msg.text;
        } else {
          // Обработка случая, когда msg.text равно undefined
          return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
        }
      }

      if (stepIndexCorrected === steps.length - 1) {
        const stand = await this.usersService.create(ctx.wizard.state.stand);
        await ctx.scene.leave();
        return `Станок ${JSON.stringify(stand, null, 2)} добавлен`;
      } else {
        ctx.wizard.next();
        return generateMessage(steps[stepIndexCorrected + 1]);
      }
    };

    return descriptor;
  };
}

@Wizard(WIZARDS.ADD_STAND)
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
  @WizardStepHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @WizardStepHandler(3)
  async step3() {}

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
}
