import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Work } from './work.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from '../../helpers';
import { WorksService } from './works.service';
import { TasksService } from '../tasks/tasks.service'; // Новый импорт

const steps: WizardStepType[] = [
  // { message: 'Задача:', field: 'task', type: 'union', union: Tasks },
  { message: 'Выберите задачу из списка:', type: 'taskSelect' },
  { message: 'Дата выполнения:', field: 'date', type: 'date' },
];

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
        ctx.wizard.state.work = new Work();
      }

      const stepForAnswerNumber = stepIndex - 2;
      const stepForRequestNumber = stepIndex - 1;

      const stepAnswer = steps[stepForAnswerNumber];
      const stepRequest = steps[stepForRequestNumber];
      console.log('*-* stepAnswer', stepAnswer);
      console.log('*-* stepRequest', stepRequest);

      const taskService = this.taskService as TasksService;

      // if (stepIndex === 1) {
      //   ctx.wizard.state.work = new Work();
      //   const tasks = await taskService.findAll();
      //
      //   if (tasks.length === 0) {
      //     await ctx.scene.leave();
      //     return 'Задач не найдено';
      //   }
      //
      //   const tasksList = await taskService.getList();
      //   ctx.wizard.next();
      //   return `${steps[stepIndex - 1].message}\n${tasksList}`;
      // }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = ctx.update?.message;
      // const isWithAnswer = msg?.text !== undefined;

      const isAwaitAnswer = !!stepAnswer;

      if (isAwaitAnswer) {
        // Handle answer
        console.log('*-* handle answer');
        if (!msg?.text) {
          return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
        }

        switch (stepAnswer.type) {
          case 'union':
            ctx.wizard.state.work[stepAnswer.field] = getValueUnionByIndex(
              stepAnswer.union,
              +msg.text - 1,
            );
            break;
          case 'number':
            const number = parseFloat(msg.text);
            if (!isNaN(number)) {
              ctx.wizard.state.work[stepAnswer.field] = number;
            } else {
              return 'Введите корректное числовое значение.';
            }
            break;
          case 'date':
            const date = Date.parse(msg.text);
            console.log('*-* Date.parse(msg.text)', Date.parse(msg.text));

            if (!isNaN(date)) {
              ctx.wizard.state.work[stepAnswer.field] = new Date(date);
            } else {
              return 'Введите корректную дату.';
            }
            break;

          case 'taskSelect':
            console.log('*-* taskSelect');
            console.log('*-* msg.text', msg.text);
            const selectedIndex = parseInt(msg.text) - 1;
            console.log('*-* selectedIndex', selectedIndex);

            const tasks = await this.taskService.findAll();
            console.log('*-* tasks --------', tasks);

            const task = tasks[selectedIndex];
            console.log('*-* task --------', task);

            if (selectedIndex >= 0 && selectedIndex < tasks.length) {
              ctx.wizard.state.work.task = task;
              console.log('*-* ctx.wizard.state.work', ctx.wizard.state.work);
            } else {
              return 'Выберите действительный номер задачи из списка.';
            }
            break;

          default:
            return 'Ошибка';
        }

        const isLastStep = stepForAnswerNumber === steps.length - 1;
        if (isLastStep) {
          console.log('*-* ctx.wizard.state.work', ctx.wizard.state.work);
          const work = await this.service.create(ctx.wizard.state.work);
          await ctx.scene.leave();
          return `Работа ${JSON.stringify(work, null, 2)} добавлен`;
        }
      }

      const isShouldSendRequest = !!stepRequest;

      if (isShouldSendRequest) {
        // Send text
        console.log('*-* send text');

        switch (stepRequest.type) {
          case 'taskSelect': {
            const tasksLint = await taskService.getList();
            console.log('*-* tasksLint', tasksLint);

            ctx.wizard.next();
            return `${steps[stepIndex - 1].message}\n${await this.taskService.getList()}`;
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

@Wizard(WIZARDS.ADD_WORK_IN_WIZARD_ID)
export class WorksAddWizard {
  constructor(
    @Inject(WorksService)
    private readonly service: WorksService,
    @Inject(TasksService)
    private readonly taskService: TasksService,
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
