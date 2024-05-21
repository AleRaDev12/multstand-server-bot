import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Task } from './task.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { SCENES_WIZARDS } from '../../shared/scenes-wizards';
import { generateMessage, getValueUnionByIndex } from '../../helpers';
import { TaskService } from './task.service'; // Новый импорт

const steps: WizardStepType[] = [
  { message: 'Категория:', field: 'category', type: 'string' },
  { message: 'Задача:', field: 'shownName', type: 'string' },
  { message: 'Оплата:', field: 'cost', type: 'number' },
  { message: 'Длительность:', field: 'duration', type: 'number' },
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
      const step = steps[stepIndexCorrected];

      if (!msg.text) {
        return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
      }

      switch (step.type) {
        case 'union':
          ctx.wizard.state.task[step.field] = getValueUnionByIndex(
            step.union,
            +msg.text - 1,
          );
          break;
        case 'number':
          const number = parseFloat(msg.text);
          if (!isNaN(number)) {
            ctx.wizard.state.task[step.field] = number;
          } else {
            return 'Введите корректное числовое значение.';
          }
          break;
        case 'string':
          ctx.wizard.state.task[step.field] = msg.text;
          break;
        case 'date':
          const date = Date.parse(msg.text);
          console.log('*-* Date.parse(msg.text)', Date.parse(msg.text));

          if (!isNaN(date)) {
            ctx.wizard.state.task[step.field] = new Date(date);
          } else {
            return 'Введите корректную дату.';
          }
          break;
        default:
          // ctx.wizard.state.task[step.field] = msg.text;
          break;
      }

      if (stepIndexCorrected === steps.length - 1) {
        console.log('*-* ctx.wizard.state.task', ctx.wizard.state.task);
        const work = await this.service.create(ctx.wizard.state.task);
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

@Wizard(SCENES_WIZARDS.ADD_TASK)
export class TasksAddWizard {
  constructor(
    @Inject(TaskService)
    private readonly service: TaskService,
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.task = new Task();
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
}
