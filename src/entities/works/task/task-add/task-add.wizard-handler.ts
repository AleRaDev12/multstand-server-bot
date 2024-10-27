import { CustomWizardContext, WizardStepType } from '../../../../shared/types';
import { Task } from '../task.entity';
import {
  generateMessage,
  getMessage,
  getValueUnionByIndex,
} from '../../../../shared/helpers';
import { TaskAddWizard } from './task-add.wizard';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage } from '../../../../shared/sendMessages';

const steps: WizardStepType[] = [
  { message: 'Категория задачи:', field: 'category', type: 'string' },
  {
    message: 'Краткое название задачи на английском в одно слово:',
    field: 'name',
    type: 'string',
  },
  {
    message: 'Название задачи на русском:',
    field: 'shownName',
    type: 'string',
  },
  { message: 'Оплата:', field: 'cost', type: 'number' },
  { message: 'Длительность:', field: 'duration', type: 'number' },
];

function getEntity(ctx: CustomWizardContext): Task {
  return ctx.wizard.state.task;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.task = new Task();
}

function save(entity: Task) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Task): Promise<void> {
  await sendMessage(ctx, `Добавлено`);
}

async function handleSpecificAnswer(
  this: TaskAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  const message = getMessage(ctx);

  switch (stepAnswer.type) {
    case 'union':
      ctx.wizard.state.task[stepAnswer.field] = getValueUnionByIndex(
        stepAnswer.union,
        +message.text - 1,
      );
      break;
    case 'number':
      const number = parseFloat(message.text);
      if (isNaN(number)) {
        await replyWithCancelButton(
          ctx,
          'Введите корректное числовое значение.',
        );
        return false;
      }
      ctx.wizard.state.task[stepAnswer.field] = number;
      break;
    case 'string':
      ctx.wizard.state.task[stepAnswer.field] = message.text;
      break;
    case 'date':
      const date = Date.parse(message.text);
      if (isNaN(date)) {
        await replyWithCancelButton(ctx, 'Введите корректную дату.');
        return false;
      }
      ctx.wizard.state.task[stepAnswer.field] = new Date(date);
      break;
    default:
      break;
  }

  return true;
}

async function handleSpecificRequest(
  this: TaskAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  await replyWithCancelButton(ctx, generateMessage(stepRequest));
  return true;
}

export const TaskWizardHandler = wizardStepHandler<Task>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
