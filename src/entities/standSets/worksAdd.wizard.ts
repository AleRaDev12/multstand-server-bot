import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Tasks, Work } from './work.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from '../../helpers';
import { WorksService } from './works.service'; // Новый импорт

const steps: WizardStepType[] = [
  { message: 'Задача:', field: 'task', type: 'union', union: Tasks },
  { message: 'Дата выполнения:', field: 'date', type: 'date' },
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

      if (!msg.text) {
        return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
      }

      switch (step.type) {
        case 'union':
          ctx.wizard.state.work[step.field] = getValueUnionByIndex(
            step.union,
            +msg.text - 1,
          );
          break;
        case 'number':
          const number = parseFloat(msg.text);
          if (!isNaN(number)) {
            ctx.wizard.state.work[step.field] = number;
          } else {
            return 'Введите корректное числовое значение.';
          }
          break;
        case 'date':
          const date = Date.parse(msg.text);
          console.log('*-* Date.parse(msg.text)', Date.parse(msg.text));

          if (!isNaN(date)) {
            ctx.wizard.state.work[step.field] = new Date(date);
          } else {
            return 'Введите корректную дату.';
          }
          break;
        default:
          ctx.wizard.state.work[step.field] = msg.text;
          break;
      }

      if (stepIndexCorrected === steps.length - 1) {
        console.log('*-* ctx.wizard.state.work', ctx.wizard.state.work);
        const work = await this.workService.create(ctx.wizard.state.work);
        await ctx.scene.leave();
        return `Работа ${JSON.stringify(work, null, 2)} добавлен`;
      } else {
        ctx.wizard.next();
        return generateMessage(steps[stepIndex - 1]);
      }
    };

    return descriptor;
  };
}

@Wizard(WIZARDS.ADD_WORK_IN_WIZARD_ID)
export class WorksAddWizard {
  constructor(
    @Inject(WorksService)
    private readonly workService: WorksService,
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.work = new Work();
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
