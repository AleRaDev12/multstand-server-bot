import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../shared/interfaces';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../UnifiedWizardHandler';
import { WorkAddWizard } from './work-add.wizard';
import { Work } from './work.entity';

const taskSelectType: DbEntities = 'taskSelect';
const standProdSelectType: DbEntities = 'standProdSelect';
const entityName = 'work';

const steps: WizardStepType[] = [
  { message: 'Задача:', type: taskSelectType },
  { message: 'Станок-изделие:', type: standProdSelectType },
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
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].task = task;
      ctx.wizard.state[entityName].cost = task.cost;
      return true;
    }

    case standProdSelectType: {
      // TODO: update types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ctx.update?.message as { text?: string };

      const selectedNumber = parseInt(message.text);

      const standsProd = await this.standProdService.findAll();
      const standProd = standsProd[selectedNumber - 1];
      if (!standProd) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].standProd = standProd;
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
      await replyWithCancelButton(ctx, `${stepRequest.message}${tasksList}`);
      return true;
    }

    case standProdSelectType: {
      const standsProdList = await this.standProdService.getList();
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${standsProdList}`,
      );
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
