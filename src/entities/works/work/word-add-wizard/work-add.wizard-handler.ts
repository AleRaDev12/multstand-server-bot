import { getMessageText } from '../../../../shared/helpers';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import {
  setFieldValue,
  WizardStepCustomHandlerType,
  wizardStepHandler,
} from '../../../../bot/wizard-step-handler-new';
import { Master } from '../../../master/master.entity';
import {
  WizardHandlerConfig,
  WizardStep,
} from '../../../../bot/wizard-step-handler-new/types';
import {
  getFieldValue,
  getWizardSteps,
} from '../../../../bot/wizard-step-handler-new/wizard-handler';
import { Task } from '../../task/task.entity';
import { StandProd } from '../../../parts/stand-prod/stand-prod.entity';
import { Work } from '../work.entity';
import { CurrentData, CurrentWizard, CurrentWizardContext } from './types';
import { taskHandler } from './taskHandler';
import { partOutHandler } from './partOutHandler';
import { standProdHandler } from './standProdHandler';
import { sendMessage } from '../../../../shared/sendMessages';
import { partOutCountHandler } from './partOutCountHandler';
import { Component } from '../../../parts/component/component.entity';
import { z } from 'zod';
import { PartOut } from '../../../parts/part-out/part-out.entity';

const steps: WizardStep<CurrentData, CurrentWizard>[] = [
  {
    message: '✨ Станок - номер изделия',
    handler: standProdHandler,
  },
  {
    message: '📅 Дата выполнения',
    field: 'date',
    type: 'date',
    required: true,
  },
  { message: '✅ Задача', handler: taskHandler },
  {
    message: '🔢 Количество (шт)',
    field: 'workCount',
    type: 'number',
    required: true,
  },
  {
    message: '✍️ Примечания\nДля почасовой - обязательно указать что сделано',
    field: 'description',
    type: 'string',
  },
];

export const partOutSteps: WizardStep<CurrentData, CurrentWizard>[] = [
  {
    message: '📋 Расход комплектующих',
    handler: partOutHandler,
    required: false,
  },
  {
    message: '🔢 Количество затраченных комплектующих (шт)',
    handler: partOutCountHandler,
    required: false,
  },
];

async function masterHandler(
  wizard: CurrentWizard,
  ctx: CurrentWizardContext,
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

const beforeFirstStep: NonNullable<
  WizardHandlerConfig<CurrentData, CurrentWizard>['beforeFirstStep']
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
  WizardHandlerConfig<CurrentData, CurrentWizard>['afterLastStep']
> = async (wizard, ctx) => {
  const result = WorkSchema.safeParse({
    task: getFieldValue(ctx, 'task'),
    standProd: getFieldValue(ctx, 'standProd'),
    master: getFieldValue(ctx, 'master'),
    paymentCoefficient: getFieldValue(ctx, 'paymentCoefficient'),
    date: getFieldValue(ctx, 'date'),
    count: getFieldValue(ctx, 'workCount'),
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

  const work = await wizard.service.create(workEntity);

  let partsOut: PartOut[];

  const componentValue = getFieldValue(ctx, 'component');
  const componentValueParsed = z
    .instanceof(Component)
    .safeParse(componentValue);
  const isWithComponentsValue = !!componentValueParsed.success;

  if (isWithComponentsValue) {
    const component = componentValueParsed.data;

    const partOutCountValue = getFieldValue(ctx, 'partOutCount');
    const partOutCountValueParsed = z.number().safeParse(partOutCountValue);
    if (!partOutCountValueParsed.success) {
      await ctx.reply('Ошибка. partOutCountValue не найден.');
      return;
    }
    const partOutCount = partOutCountValueParsed.data;

    try {
      partsOut = await wizard.partsService.writeOffComponents(
        component.id,
        partOutCount,
        workEntity.date,
        workEntity.standProd,
        work,
      );
      await sendMessage(
        ctx,
        `Успешно списано ${partOutCount} компонентов с ${partsOut.length} партий.`,
      );
    } catch (error) {
      await replyWithCancelButton(ctx, `Ошибка: ${error.message}`);
      return;
    }
  }

  const managers = await wizard.userService.findManagers();
  const currentUser = await wizard.userService.findByTelegramId(ctx.from.id);

  for (const manager of managers) {
    await wizard.bot.telegram.sendMessage(
      manager.telegramUserId,
      `${currentUser.name} отправил отчёт:\n${work.format('manager')}\n\nСтанок:\n${work.standProd.format('manager')}\n\n${partsOut?.length ? `Комплектующие:\n${partsOut.map((partOut) => partOut.format('manager'))}` : ''}`,
    );
  }
};

export const WorkAddWizardHandler = wizardStepHandler<
  CurrentData,
  CurrentWizard
>({
  beforeFirstStep,
  initialSteps: steps,
  afterLastStep,
});
