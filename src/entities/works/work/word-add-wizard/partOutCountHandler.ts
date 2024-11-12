import {
  setFieldValue,
  WizardStepCustomHandlerType,
} from '../../../../bot/wizard-step-handler-new';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import { getFieldValue } from '../../../../bot/wizard-step-handler-new/wizard-handler';
import { z } from 'zod';
import { CurrentWizard, CurrentWizardContext } from './types';
import { getMessageText } from '../../../../shared/helpers';
import { Component } from '../../../parts/component/component.entity';
import { parseValue } from '../../../../bot/wizard-step-handler-new/utils';
import { isValidResult } from '../../../../bot/wizard-step-handler-new/wizard-operations';

export async function partOutCountHandler(
  wizard: CurrentWizard,
  ctx: CurrentWizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    return true;
  }

  const message = getMessageText(ctx);
  const inputPartOutCount = parseValue(message, 'number');

  if (!isValidResult(inputPartOutCount)) {
    await replyWithCancelButton(
      ctx,
      `Некорректный ввод. ${inputPartOutCount.error}. Повторите.`,
    );
    return false;
  }
  const inputPartOutCountValue = inputPartOutCount.value;

  const componentValue = getFieldValue(ctx, 'component');
  const result = z.instanceof(Component).safeParse(componentValue);
  if (!result.success) {
    await ctx.reply('Ошибка. Мастер для подсчёта коэффициента не найден.');
    return false;
  }
  const component = result.data;

  try {
    const totalRemaining = await wizard.partsService.getTotalRemainingCount(
      component.id,
    );
    if (totalRemaining.inStock < inputPartOutCountValue) {
      await replyWithCancelButton(
        ctx,
        `Недостаточно компонентов в остатке ${totalRemaining.inStock}. Пожалуйста, введите реальное значение.`,
      );
      return false;
    }

    setFieldValue(ctx, 'partOutCount', inputPartOutCountValue);

    return true;
  } catch (error) {
    await replyWithCancelButton(ctx, `Ошибка: ${error.message}`);
    return false;
  }
}
