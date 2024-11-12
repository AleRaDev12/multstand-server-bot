import {
  setFieldValue,
  WizardStepCustomHandlerType,
} from '../../../../bot/wizard-step-handler-new';
import { sendMessages } from '../../../../shared/sendMessages';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import { CurrentWizard, CurrentWizardContext } from './types';
import { getMessageText } from '../../../../shared/helpers';
import { isValidResult } from '../../../../bot/wizard-step-handler-new/wizard-operations';
import { parseValue } from '../../../../bot/wizard-step-handler-new/utils';

export async function standProdHandler(
  wizard: CurrentWizard,
  ctx: CurrentWizardContext,
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
