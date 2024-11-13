import {
  setFieldValue,
  WizardStepCustomHandlerType,
} from '../../../../bot/wizard-step-handler-new';
import { sendMessages } from '../../../../shared/sendMessages';
import {
  formatWithListIndexes,
  getMessageText,
} from '../../../../shared/helpers';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import {
  addWizardSteps,
  getFieldValue,
  removeWizardSteps,
} from '../../../../bot/wizard-step-handler-new/wizard-handler';
import { z } from 'zod';
import { Master } from '../../../master/master.entity';
import { CurrentWizard, CurrentWizardContext } from './types';
import { parseValue } from '../../../../bot/wizard-step-handler-new/utils';
import { isValidResult } from '../../../../bot/wizard-step-handler-new/wizard-operations';
import { partOutSteps } from './work-add.wizard-handler';

export async function taskHandler(
  wizard: CurrentWizard,
  ctx: CurrentWizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const user = await wizard.userService.findByTelegramId(ctx.from.id);
    const paymentCoefficient = user.master.paymentCoefficient;

    const tasks = await wizard.taskService.findAll();
    const tasksFormatted = tasks.map((task) =>
      task.format(ctx.session.userRole, 'line', paymentCoefficient),
    );

    await sendMessages(ctx, formatWithListIndexes(tasksFormatted), 'line');
    await replyWithCancelButton(ctx, `Выберите задачу из списка`);
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

  const tasks = await wizard.taskService.findAllWithComponents();
  const task = tasks[selectedNumber.value - 1];

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

  if (task.components.length) {
    addWizardSteps(ctx, partOutSteps, -1);
    setFieldValue(ctx, 'isWithComponents', true);
    return true;
  }

  removeWizardSteps(ctx, partOutSteps);
  setFieldValue(ctx, 'isWithComponents', false);
  return true;
}
