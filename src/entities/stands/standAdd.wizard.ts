import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { LedStripType, PaintingType, Stand, StandModel } from './stand.entity';
import { StandsService } from './stands.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import { getValueByIndex, printEnum } from '../../helpers'; // Новый импорт

interface WizardStep {
  message: string;
  field: keyof Stand;
  enum?: object;
}

const steps: WizardStep[] = [
  { message: 'Модель:', field: 'model', enum: StandModel },
  { message: 'Покраска:', field: 'painting', enum: PaintingType },
  { message: 'Количество обычных стёкол:', field: 'glassesRegular' },
  { message: 'Количество стёкол пп:', field: 'glassesHighTransparency' },
  {
    message: 'Светодиодная лента:',
    field: 'ledStripModel',
    enum: LedStripType,
  },
  { message: 'Ткань для затенения:', field: 'shadingFabric' },
  { message: 'Штатив для объёмной анимации:', field: 'tripod' },
];

function generateMessage(step: WizardStep): string {
  return step.enum ? `${step.message}\n${printEnum(step.enum)}` : step.message;
}

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
          // @ts-expect-error
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
