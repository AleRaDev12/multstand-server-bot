import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/types';
import { WorkAddWizard } from './work-add.wizard';
import { Work } from './work.entity';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage, sendMessages } from '../../../shared/sendMessages';

const masterSelectType: AdditionalWizardSelections = 'masterSelect';
const taskSelectType: AdditionalWizardSelections = 'taskSelect';
const standProdSelectType: AdditionalWizardSelections = 'standProdSelect';
const entityName = 'work';

const commonSteps: WizardStepType[] = [
  { message: 'Задача №:', type: taskSelectType },
  {
    message: 'Станок-изделие - указываем номер изделия:',
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

async function save(
  this: WorkAddWizard,
  entity: Work,
  ctx?: CustomWizardContext,
) {
  const work = await this.service.create(entity);

  const managers = await this.userService.findManagers();
  const currentUser = await this.userService.findByTelegramId(ctx.from.id);

  for (const manager of managers) {
    await this.bot.telegram.sendMessage(
      manager.telegramUserId,
      `${currentUser.name} отправил отчёт:\n${entity.format('manager')}`,
    );
  }

  return work;
}

async function print(ctx: CustomWizardContext): Promise<void> {
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

      const tasksList = await this.taskService.getFormattedList(
        ctx.session.userRole,
      );

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${tasksList.map((taskString, index) => `№${index + 1}. ${taskString}\n`)}`,
      );
      return true;
    }

    case masterSelectType: {
      const masterList = await this.masterService.getList();
      await replyWithCancelButton(ctx, `${stepRequest.message}${masterList}`);
      return true;
    }

    case standProdSelectType: {
      const standsProdList = await this.standProdService.findActive();
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
        formattedList.map((message) => `${message}`),
      );

      await replyWithCancelButton(ctx, `-`);
      return true;
    }

    default:
      return undefined;
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
      if (Number.isNaN(selectedNumber)) {
        await replyWithCancelButton(ctx, 'Некорректный ввод. Повторите.');
        return false;
      }

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

      const selectedNumber = parseInt(message.text);
      if (Number.isNaN(selectedNumber)) {
        await replyWithCancelButton(ctx, 'Некорректный ввод. Повторите.');
        return false;
      }

      const standsProd = await this.standProdService.findActive();
      const selectedStandProd = standsProd.find(
        (standProd) => standProd.id === selectedNumber,
      );

      if (!selectedStandProd) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].standProd = selectedStandProd;
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
