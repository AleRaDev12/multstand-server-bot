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
import { standProdHandler } from './standProdHandler';
import { sendMessage } from '../../../../shared/sendMessages';
import { Component } from '../../../parts/component/component.entity';
import { z } from 'zod';
import { PartOut } from '../../../parts/part-out/part-out.entity';
import { unifiedPartOutHandler } from './unifiedPartOutHandler';

const steps: WizardStep<CurrentData, CurrentWizard>[] = [
  {
    message: '✨ Станок - номер изделия',
    handler: standProdHandler,
    required: true,
  },
  {
    message: '📅 Дата выполнения',
    field: 'date',
    type: 'date',
    required: true,
  },
  { message: '✅ Задача', handler: taskHandler },
  {
    message: '🔢 Количество повторений задачи (шт)',
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
    message:
      '📋 Выберите компоненты и укажите их количествов формате:\n' +
      'номер-количество, номер-количество\n' +
      'Например: 1-2, 3-5, 4-2',
    handler: unifiedPartOutHandler,
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
  task: z.instanceof(Task, { message: 'Некорректный тип task' }),
  master: z.instanceof(Master, { message: 'Некорректный тип master' }),
  standProd: z.instanceof(StandProd, {
    message: 'Некорректный тип standProd',
  }),
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
  // Validate the core work data using Zod schema
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

  // Create and save the work entity
  const workEntity = new Work(result.data);
  const work = await wizard.service.create(workEntity);

  // Handle component selections and parts out
  const componentSelectionsValue = getFieldValue(ctx, 'componentSelections');

  let allPartsOut: PartOut[] = [];

  if (componentSelectionsValue !== undefined) {
    const ComponentSelectionsSchema = z.array(
      z.object({
        component: z.instanceof(Component),
        count: z.number().positive(),
      }),
    );

    const componentSelectionsResult = ComponentSelectionsSchema.safeParse(
      componentSelectionsValue,
    );

    if (!componentSelectionsResult.success) {
      await ctx.reply('Ошибка типов при обработке выбранных компонентов');
      return;
    }

    const componentSelections = componentSelectionsResult.data;

    if (componentSelections.length) {
      try {
        // Process each component selection
        for (const selection of componentSelections) {
          const partsOut = await wizard.partsService.writeOffComponents(
            selection.component.id,
            selection.count,
            workEntity.date,
            workEntity.standProd,
            work,
          );
          allPartsOut = allPartsOut.concat(partsOut);
        }

        // Summarize the component write-offs
        const summary = componentSelections
          .map(
            (selection) =>
              `${selection.component.name}: ${selection.count}шт с ${
                allPartsOut.filter(
                  (p) => p.partIn.component.id === selection.component.id,
                ).length
              } партий`,
          )
          .join('\n');

        await sendMessage(ctx, `Успешно списаны компоненты:\n${summary}`);
      } catch (error) {
        await replyWithCancelButton(
          ctx,
          `Ошибка при списании компонентов: ${error.message}`,
        );
        return;
      }
    }
  }

  // Notify managers about the new work report
  const managers = await wizard.userService.findManagers();
  const currentUser = await wizard.userService.findByTelegramId(ctx.from.id);

  // Format the notification message
  const notificationMessage = [
    `${currentUser.name} отправил отчёт:`,
    work.format('manager'),
    '\nСтанок:',
    work.standProd.format('manager'),
  ];

  // Add components information if any were used
  if (allPartsOut.length) {
    notificationMessage.push(
      '\nКомплектующие:',
      allPartsOut.map((partOut) => partOut.format('manager')).join('\n'),
    );
  }

  // Send notifications to all managers
  for (const manager of managers) {
    await wizard.bot.telegram.sendMessage(
      manager.telegramUserId,
      notificationMessage.join('\n'),
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
