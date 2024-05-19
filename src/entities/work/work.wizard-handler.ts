import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../shared/interfaces';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';
import { WorkAddWizard } from './work-add.wizard';
import { Work } from './work.entity';

const taskSelectType: DbEntities = 'taskSelect';
const componentSelectType: DbEntities = 'componentSelect';
const entityName = 'work';

const steps: WizardStepType[] = [
  { message: 'Задача:', type: taskSelectType },
  { message: 'Количество:', field: 'count', type: 'number' },
  { message: 'Дата выполнения:', field: 'date', type: 'date' },
];

function getEntity(ctx: CustomWizardContext): Work {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Work();
}

function save(entity: Work) {
  return this.service.create({ ...entity, createdAt: new Date() });
}

async function print(ctx: CustomWizardContext, entity: Work): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

async function handleSpecificAnswer(
  this: WorkAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case taskSelectType: {
      // TODO: update types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ctx.update?.message as { text?: string };

      const selectedNumber = parseInt(message.text);

      const tasks = await this.taskService.findAll();
      const task = tasks[selectedNumber - 1];
      if (!task) {
        await ctx.reply('Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].task = task;
      ctx.wizard.state[entityName].cost = task.cost;
      return true;
    }

    default:
      return true;
  }
}

async function handleSpecificRequest(
  this: WorkAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case taskSelectType: {
      const tasksList = await this.taskService.getList();
      await ctx.reply(`${stepRequest.message}${tasksList}`);
      return true;
    }

    default:
      return true;
  }
}

export const WorkWizardHandler = UnifiedWizardHandler<Work>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
