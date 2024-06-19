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

const masterSelectType: DbEntities = 'masterSelect';
const taskSelectType: DbEntities = 'taskSelect';
const standProdSelectType: DbEntities = 'standProdSelect';
const entityName = 'work';

const steps: WizardStepType[] = [
  { message: 'Мастер:', type: masterSelectType },
  { message: 'Задача:', type: taskSelectType },
  {
    message: 'Станок-изделие. Можно выбрать несколько (номера через запятую):',
    type: standProdSelectType,
  },
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

async function handleSpecificRequest(
  this: WorkAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case masterSelectType: {
      const masterList = await this.masterService.getList();
      await replyWithCancelButton(ctx, `${stepRequest.message}${masterList}`);
      return true;
    }

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

async function handleSpecificAnswer(
  this: WorkAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case masterSelectType: {
      // TODO: update types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ctx.update?.message as { text?: string };

      const selectedNumber = parseInt(message.text);

      const masters = await this.masterService.findAll();
      const master = masters[selectedNumber - 1];
      if (!master) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].master = master;
      return true;
    }

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

      const selectedNumbers = message.text
        .split(',')
        .map((num) => parseInt(num.trim()));

      const standsProd = await this.standProdService.findAll();
      const selectedStandsProd = selectedNumbers
        .map((num) => standsProd[num - 1])
        .filter((standProd) => standProd !== undefined);

      if (selectedStandsProd.length === 0) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      if (!ctx.wizard.state[entityName].standProd) {
        ctx.wizard.state[entityName].standProd = [];
      }

      ctx.wizard.state[entityName].standProd.push(...selectedStandsProd);
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
