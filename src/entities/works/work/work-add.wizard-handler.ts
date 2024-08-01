import {
  AdditionalWizardSelections,
  CustomWizardContext,
  UserRole,
  WizardStepType,
} from '../../../shared/interfaces';
import { WorkAddWizard } from './work-add.wizard';
import { Work } from './work.entity';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage, sendMessages } from '../../../shared/senMessages';

const masterSelectType: AdditionalWizardSelections = 'masterSelect';
const taskSelectType: AdditionalWizardSelections = 'taskSelect';
const standProdSelectType: AdditionalWizardSelections = 'standProdSelect';
const entityName = 'work';

const commonSteps: WizardStepType[] = [
  { message: 'Задача:', type: taskSelectType },
  {
    message: 'Станок-изделие:',
    type: standProdSelectType,
  },
  { message: 'Количество:', field: 'count', type: 'number' },
  { message: 'Дата выполнения:', field: 'date', type: 'date' },
  {
    message: 'Описание (для почасовой - обязательно):',
    field: 'description',
    type: 'string',
  },
];

const initialSteps: WizardStepType[] = [...commonSteps];

function getEntity(ctx: CustomWizardContext): Work {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Work();
}

function save(this: WorkAddWizard, entity: Work) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Work): Promise<void> {
  await sendMessage(ctx, `Добавлено`);
}

async function handleSpecificRequest(
  this: WorkAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case taskSelectType: {
      const telegramUserId = ctx.from.id;
      const master =
        await this.masterService.getMasterByTelegramId(telegramUserId);

      if (master.user.role === 'manager') {
        ctx.wizard.state.steps.splice(1, 0, {
          message: 'Мастер:',
          type: masterSelectType,
        });
      } else {
        if (!master) {
          await replyWithCancelButton(
            ctx,
            'Попытка автоматического выбора мастера. Ошибка.',
          );
          return false;
        }

        ctx.wizard.state[entityName].master = master;
      }

      const tasksList = await this.taskService.getList();
      await replyWithCancelButton(ctx, `${stepRequest.message}${tasksList}`);
      return true;
    }

    case masterSelectType: {
      const masterList = await this.masterService.getList();
      await replyWithCancelButton(ctx, `${stepRequest.message}${masterList}`);
      return true;
    }

    case standProdSelectType: {
      const standsProdList = await this.standProdService.findAll();
      const formattedList = await this.standProdService.formatList(
        standsProdList,
        ctx.session.userRole,
      );

      if (formattedList.length === 0) {
        await replyWithCancelButton(ctx, 'Записей нет');
        return true;
      }

      await sendMessage(ctx, stepRequest.message);
      await sendMessages(
        ctx,
        formattedList.map((message, index) => `№${index + 1}\n${message}`),
      );

      await replyWithCancelButton(ctx, `-`);
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
    case taskSelectType: {
      const message = getMessage(ctx);

      const selectedNumber = parseInt(message.text);

      const tasks = await this.taskService.findAll();
      const task = tasks[selectedNumber - 1];
      if (!task) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      const telegramUserId = ctx.from.id;
      const master =
        await this.masterService.getMasterByTelegramId(telegramUserId);
      if (!master) {
        await replyWithCancelButton(ctx, 'Мастер не найден. Ошибка.');
        return false;
      }

      ctx.wizard.state[entityName].task = task;
      ctx.wizard.state[entityName].cost = task.cost;
      ctx.wizard.state[entityName].paymentCoefficient =
        master.paymentCoefficient;
      return true;
    }

    case masterSelectType: {
      const message = getMessage(ctx);

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

    case standProdSelectType: {
      const message = getMessage(ctx);

      const selectedNumbers = message.text
        .split(',')
        .map((num) => parseInt(num.trim()));

      if (ctx.session.userRole !== 'manager' && selectedNumbers.length !== 1) {
        await replyWithCancelButton(
          ctx,
          'Вы можете выбрать только одно изделие',
        );
        return false;
      }

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

export const WorkAddWizardHandler = wizardStepHandler<Work>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: initialSteps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
