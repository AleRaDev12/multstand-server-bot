import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { StandSet } from './stand-set.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import { generateMessage, WizardStepType } from '../../helpers';
import { StandSetsService } from './stand-sets.service';
import { StandModel, StandModelType } from '../stands/stand.entity';

const commonSteps: WizardStepType[] = [
  { message: 'Модель:', field: 'model', type: 'enum', enum: StandModel },
  {
    message: 'Тип обработки:',
    field: 'processing',
    type: 'enum',
    enum: [
      'Только шлифовка',
      'Шлифовка, лак',
      'Шлифовка, белая эмаль, лак',
      'Шлифовка, чёрная эмаль, лак',
    ],
  },
  {
    message: 'Крепление для смартфона (количество):',
    field: 'smartphoneMount',
    type: 'number',
  },
  {
    message: 'Штатив для объёмной анимации:',
    field: 'tripod',
    type: 'enum',
    enum: ['Комплект №1', 'Комплект №2', 'Комплект №3'],
  },
  {
    message: 'Тип светодиодной ленты:',
    field: 'ledType',
    type: 'enum',
    enum: ['Эконом', 'Премиум'],
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

function WizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const stepIndexCorrected = stepIndex - 2;

    descriptor.value = async function (ctx: CustomWizardContext) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = ctx.update?.message;
      const step = ctx.wizard.state.steps[stepIndexCorrected];

      if (!msg?.text) {
        return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
      }

      switch (step.type) {
        case 'enum':
          ctx.wizard.state.standSet[step.field] = msg.text;
          break;
        case 'number':
          const number = parseInt(msg.text, 10);
          if (!isNaN(number)) {
            ctx.wizard.state.standSet[step.field] = number;
          } else {
            return 'Введите корректное числовое значение.';
          }
          break;
        case 'boolean':
          const value = msg.text.toLowerCase();
          if (value === 'да' || value === 'yes') {
            ctx.wizard.state.standSet[step.field] = true;
          } else if (value === 'нет' || value === 'no') {
            ctx.wizard.state.standSet[step.field] = false;
          } else {
            return 'Введите "да" или "нет".';
          }
          break;
        default:
          ctx.wizard.state.standSet[step.field] = msg.text;
          break;
      }

      if (stepIndexCorrected === ctx.wizard.state.steps.length - 1) {
        const standSet = await this.standSetsService.create(
          ctx.wizard.state.standSet,
        );
        await ctx.scene.leave();
        return `Набор характеристик станка ${JSON.stringify(standSet, null, 2)} добавлен.`;
      } else {
        ctx.wizard.next();
        return generateMessage(ctx.wizard.state.steps[stepIndexCorrected + 1]);
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
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.standSet = new StandSet();
    ctx.wizard.state.steps = [...commonSteps];
    ctx.wizard.next();
    return generateMessage(ctx.wizard.state.steps[0]);
  }

  @On('text')
  @WizardStep(2)
  async onModel(@Ctx() ctx: CustomWizardContext): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const msg = ctx.update?.message;
    if (!msg?.text) {
      return 'Некорректный ввод. Пожалуйста, введите модель станка.';
    }

    ctx.wizard.state.standSet.model = msg.text as unknown as StandModelType;

    switch (msg.text) {
      case StandModel.mTM15:
      case StandModel.mTL15:
        ctx.wizard.state.steps.push(...tmtlSteps);
        break;
      case StandModel.m3DM5:
      case StandModel.m3DL5:
        ctx.wizard.state.steps.push(...threeDSteps);
        break;
    }

    ctx.wizard.next();
    return generateMessage(ctx.wizard.state.steps[1]);
  }

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
