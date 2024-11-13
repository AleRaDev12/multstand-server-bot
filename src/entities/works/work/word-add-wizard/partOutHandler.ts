import {
  setFieldValue,
  WizardStepCustomHandlerType,
} from '../../../../bot/wizard-step-handler-new';
import { sendMessages } from '../../../../shared/sendMessages';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import { getFieldValue } from '../../../../bot/wizard-step-handler-new/wizard-handler';
import { z } from 'zod';
import { CurrentWizard, CurrentWizardContext } from './types';
import { Task } from '../../task/task.entity';
import {
  formatWithListIndexes,
  getMessageText,
} from '../../../../shared/helpers';
import { Component } from '../../../parts/component/component.entity';

export async function partOutHandler(
  wizard: CurrentWizard,
  ctx: CurrentWizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const linkedComponents = await getTaskLinkedComponents(ctx);

    if (!linkedComponents?.length) {
      await ctx.reply('Связанные компоненты не найдены');
      return true;
    }

    const formattedComponents = linkedComponents.map((component) =>
      component.format(ctx.session.userRole, 'line'),
    );

    await sendMessages(
      ctx,
      formatWithListIndexes(formattedComponents),
      'nothing',
    );
    return true;
  }

  const message = getMessageText(ctx);
  const selectedNumber = parseInt(message);

  const linkedComponents = await getTaskLinkedComponents(ctx);

  if (!linkedComponents?.length) {
    await ctx.reply('Связанные компоненты не найдены');
    return true;
  }

  const component = linkedComponents[selectedNumber - 1];
  if (!component) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }
  setFieldValue(ctx, 'component', component);
  return true;
}

async function getTaskLinkedComponents(
  ctx: CurrentWizardContext,
): Promise<Component[] | null> {
  const taskValue = getFieldValue(ctx, 'task');
  const result = z.instanceof(Task).safeParse(taskValue);
  if (!result.success) {
    await ctx.reply('Ошибка при получении задачи.');
    return null;
  }
  const task = result.data;
  return task.components;
}
