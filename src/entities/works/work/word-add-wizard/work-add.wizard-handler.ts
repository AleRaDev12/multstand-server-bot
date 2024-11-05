import { WorkAddWizard } from './work-add.wizard';
import {
  formatWithListIndexes,
  getMessageText,
} from '../../../../shared/helpers';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import { sendMessages } from '../../../../shared/sendMessages';
import {
  setFieldValue,
  WizardStepCustomHandlerType,
  wizardStepHandler,
} from '../../../../bot/wizard-step-handler-new';
import { Master } from '../../../master/master.entity';
import { StepWizardContext } from '../../../../bot/wizard-step-handler-new/wizard-context-types';
import {
  WizardHandlerConfig,
  WizardStep,
} from '../../../../bot/wizard-step-handler-new/types';
import {
  getFieldValue,
  getWizardSteps,
} from '../../../../bot/wizard-step-handler-new/wizard-handler';
import { z } from 'zod';
import { Task } from '../../task/task.entity';
import { parseValue } from '../../../../bot/wizard-step-handler-new/utils';
import { isValidResult } from '../../../../bot/wizard-step-handler-new/wizard-operations';
import { StandProd } from '../../../parts/stand-prod/stand-prod.entity';
import { Work } from '../work.entity';

type Data = {
  master: Master;
  task: Task;
  savedCost: number;
  paymentCoefficient: number;
  standProd: StandProd;
  count: number;
  date: Date;
  description: string;
};

type Wizard = WorkAddWizard;
type WizardContext = StepWizardContext<Data, Wizard>;

const steps: WizardStep<Data, Wizard>[] = [
  { message: 'Задача №', handler: taskHandler },
  {
    message: 'Станок-изделие - указываем номер изделия',
    handler: standProdHandler,
  },
  { message: 'Количество', field: 'count', type: 'number', required: true },
  { message: 'Дата выполнения', field: 'date', type: 'date', required: true },
  {
    message: 'Описание (для почасовой - обязательно)',
    field: 'description',
    type: 'string',
  },
];

async function taskHandler(
  wizard: Wizard,
  ctx: WizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const tasksList = await wizard.taskService.getFormattedList(
      ctx.session.userRole,
      'line',
    );

    await sendMessages(ctx, formatWithListIndexes(tasksList), 'line');
    await replyWithCancelButton(ctx, `Выберите задачу из списка`);
    return true;
  }

  const message = getMessageText(ctx);
  const selectedNumber = parseInt(message);

  const tasks = await wizard.taskService.findAll();
  const task = tasks[selectedNumber - 1];

  if (!task) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }

  const masterEntity = getFieldValue(ctx, 'master');
  console.log('*-* masterEntity', masterEntity);
  const result = z.instanceof(Master).safeParse(masterEntity);
  if (!result.success) {
    await ctx.reply('Ошибка. Мастер для подсчёта коэффициента не найден.');
    return false;
  }
  const master = result.data;

  setFieldValue(ctx, 'paymentCoefficient', master.paymentCoefficient);
  setFieldValue(ctx, 'task', task);
  setFieldValue(ctx, 'savedCost', task.cost);
  return true;
}

async function masterHandler(
  wizard: Wizard,
  ctx: WizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const masterList = await wizard.masterService.getList();
    await replyWithCancelButton(ctx, masterList);
    return true;
  }

  const message = getMessageText(ctx);

  const selectedNumber = parseInt(message);
  if (Number.isNaN(selectedNumber)) {
    await replyWithCancelButton(ctx, 'Некорректный ввод. Повторите.');
    return false;
  }

  const masters = await wizard.masterService.findAll();
  const master = masters[selectedNumber - 1];
  if (!master) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }

  setFieldValue(ctx, 'master', master);
  return true;
}

async function standProdHandler(
  wizard: Wizard,
  ctx: WizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const standsProdList = await wizard.standProdService.findActive();
    const formattedList = await wizard.standProdService.formatList(
      standsProdList,
      ctx.session.userRole,
    );

    if (formattedList.length === 0) {
      await replyWithCancelButton(ctx, 'Записей нет');
      return true;
    }

    await sendMessages(
      ctx,
      formattedList.map((message) => message),
    );

    await replyWithCancelButton(ctx, `-`);
    return true;
  }

  const message = getMessageText(ctx);
  const selectedNumber = parseValue(message, 'number');

  if (!isValidResult(selectedNumber)) {
    await replyWithCancelButton(
      ctx,
      `Некорректный ввод. ${selectedNumber.error}. Повторите.`,
    );
    return false;
  }

  const standsProd = await wizard.standProdService.findActive();
  const selectedStandProd = standsProd.find(
    (standProd) => standProd.id === selectedNumber.value,
  );

  if (!selectedStandProd) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }

  setFieldValue(ctx, 'standProd', selectedStandProd);
  return true;
}

const beforeFirstStep: NonNullable<
  WizardHandlerConfig<any, Wizard>['beforeFirstStep']
> = async (wizard, ctx) => {
  if (ctx.session.userRole === 'manager') {
    getWizardSteps(ctx).splice(0, 0, {
      message: 'Мастер',
      handler: masterHandler,
    });
    return;
  }

  const master = await wizard.masterService.getMasterByTelegramId(ctx.from.id);
  setFieldValue(ctx, 'master', master);
};

const WorkSchema = z.object({
  task: z.instanceof(Task, { message: 'Некорректный тип задачи' }),
  master: z.instanceof(Master, { message: 'Некорректный тип мастера' }),
  standProd: z.instanceof(StandProd, { message: 'Некорректный тип стенда' }),
  date: z.instanceof(Date, { message: 'Некорректная дата' }),
  cost: z.number({ invalid_type_error: 'Стоимость должна быть числом' }),
  count: z.number({ invalid_type_error: 'Количество должно быть числом' }),
  paymentCoefficient: z.number({
    invalid_type_error: 'Коэффициент должен быть числом',
  }),
  description: z
    .string({ invalid_type_error: 'Описание должно быть текстом' })
    .optional(),
});

const afterLastStep: NonNullable<
  WizardHandlerConfig<any, Wizard>['afterLastStep']
> = async (wizard, ctx) => {
  const result = WorkSchema.safeParse({
    task: getFieldValue(ctx, 'task'),
    standProd: getFieldValue(ctx, 'standProd'),
    master: getFieldValue(ctx, 'master'),
    paymentCoefficient: getFieldValue(ctx, 'paymentCoefficient'),
    date: getFieldValue(ctx, 'date'),
    count: getFieldValue(ctx, 'count'),
    cost: getFieldValue(ctx, 'savedCost'),
    description: getFieldValue(ctx, 'description'),
  });

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `Поле '${issue.path.join('.')}': ${issue.message}`)
      .join('\n');

    await ctx.reply(`Ошибка при создании работы:\n${errors}`);
    return;
  }

  const workEntity = new Work(result.data);

  // *-*
  const work = await wizard.service.create(workEntity);

  const managers = await wizard.userService.findManagers();
  const currentUser = await wizard.userService.findByTelegramId(ctx.from.id);

  for (const manager of managers) {
    await wizard.bot.telegram.sendMessage(
      manager.telegramUserId,
      // *-* workEntity is temporary - replace with work
      `${currentUser.name} отправил отчёт:\n${workEntity.format('manager')}`,
    );
  }
};

export const WorkAddWizardHandler = wizardStepHandler<Data, Wizard>({
  beforeFirstStep,
  initialSteps: steps,
  afterLastStep,
});
