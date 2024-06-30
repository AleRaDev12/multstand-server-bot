import { CustomWizardContext } from '../../shared/interfaces';
import { getMessage } from '../../shared/helpers';
import { replyWithCancelButton } from './utils';

export async function handleNumberInput<T>(
  ctx: CustomWizardContext,
  field: string,
  entity: T,
): Promise<boolean> {
  const message = getMessage(ctx);
  const number = parseFloat(message.text);
  if (!isNaN(number)) {
    entity[field] = number;
    return true;
  }
  await replyWithCancelButton(ctx, 'Please enter a valid numeric value.');
  return false;
}

export async function handleBooleanInput<T>(
  ctx: CustomWizardContext,
  field: string,
  entity: T,
): Promise<boolean> {
  const message = getMessage(ctx);
  const value = message.text.toLowerCase();
  let booleanValue: boolean;

  switch (value) {
    case 'да':
    case 'yes':
    case '1':
      booleanValue = true;
      break;
    case 'нет':
    case 'no':
    case '0':
      booleanValue = false;
      break;
    default:
      await replyWithCancelButton(
        ctx,
        `Enter "да", "нет", "yes", "no", 1 or 0.`,
      );
      return false;
  }
  entity[field] = booleanValue;
  return true;
}

export async function handleDateInput<T>(
  ctx: CustomWizardContext,
  field: string,
  entity: T,
): Promise<boolean> {
  const message = getMessage(ctx);
  if (ctx.wizard.state.selectedDate) {
    entity[field] = ctx.wizard.state.selectedDate;
    ctx.wizard.state.selectedDate = undefined;
    return true;
  }

  const now = new Date();
  let resultDate: Date | null = null;

  if (/^\d{1,2}$/.test(message.text)) {
    resultDate = handleShortDateInput(message.text, now);
  } else {
    resultDate = handleFullDateInput(message.text);
  }

  if (resultDate && resultDate.getTime() > 0) {
    entity[field] = resultDate;
    return true;
  }

  await replyWithCancelButton(ctx, 'Please enter a valid date.');
  return false;
}

function handleShortDateInput(text: string, now: Date): Date | null {
  const day = parseInt(text);
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  if (day > 0 && day <= lastDayOfMonth) {
    return new Date(now.getFullYear(), now.getMonth(), day);
  }
  return null;
}

function handleFullDateInput(text: string): Date | null {
  const parsedDate = new Date(text);
  if (
    !isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === text
  ) {
    return parsedDate;
  }
  return null;
}
