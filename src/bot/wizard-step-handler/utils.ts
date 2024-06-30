import { Markup } from 'telegraf';
import { CustomWizardContext } from '../../shared/interfaces';
import { getMessage, getValueUnionByIndex } from '../../shared/helpers';
import { BotActions } from '../bot.update';

export async function replyWithCancelButton(
  ctx: CustomWizardContext,
  message: string,
) {
  await ctx.reply(
    message,
    Markup.inlineKeyboard([
      Markup.button.callback('Отмена', BotActions.CANCEL),
    ]),
  );
}

export async function handleAnswerUnion<T>(
  ctx: CustomWizardContext,
  field: string,
  union: object,
  entity: T,
) {
  const message = getMessage(ctx);
  const optionNumber = +message.text;
  const unionKeys = Object.keys(union);

  if (optionNumber < 1 || optionNumber > unionKeys.length) {
    await replyWithCancelButton(
      ctx,
      'Invalid value. Please enter the value again.',
    );
    return false;
  }

  entity[field] = getValueUnionByIndex(union, optionNumber - 1);
  return true;
}
