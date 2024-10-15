import { format } from 'date-fns';
import { generateMessage } from '../../shared/helpers';
import { UnifiedWizardHandlerOptions } from './types';
import { BaseEntity } from '../../entities/base.entity';
import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { replyWithCancelButton } from './utils';
import { sendMessage } from '../../shared/sendMessages';

export async function sendRequest<T extends BaseEntity>(
  this: any,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
  stepIndex: number,
  handleSpecificRequest: UnifiedWizardHandlerOptions<T>['handleSpecificRequest'],
): Promise<boolean> {
  const steps = ctx.wizard.state.steps;

  switch (stepRequest.type) {
    case 'union':
    case 'number':
    case 'string':
    case 'boolean':
    case 'date': {
      await replyWithCancelButton(ctx, generateMessage(steps[stepIndex - 1]));
      if (stepRequest.type === 'date') {
        await sendDateOptions(ctx);
      }
      ctx.wizard.next();
      return true;
    }
    default: {
      if (handleSpecificRequest) {
        const result = await handleSpecificRequest.call(this, ctx, stepRequest);
        if (result) ctx.wizard.next();
        return result;
      } else {
        await replyWithCancelButton(ctx, 'Error: Unsupported request type');
        return false;
      }
    }
  }
}

async function sendDateOptions(ctx: CustomWizardContext) {
  const today = new Date();
  const monthName = format(today, 'MMMM');
  await sendMessage(
    ctx,
    `В формате "ГГГГ-ММ-ДД"\nИли день текущего месяца (текущий месяц сервера — ${monthName})`,
  );
}
