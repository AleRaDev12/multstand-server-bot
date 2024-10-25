import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { getMessage } from '../../shared/helpers';
import { BaseWizardHandlerOptions } from './types';
import { handleAnswerUnion, replyWithCancelButton } from './utils';
import {
  handleBooleanInput,
  handleDateInput,
  handleNumberInput,
} from './inputHandlers';

export async function handleInputByType<T>(
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: T,
  handleSpecificAnswer: BaseWizardHandlerOptions<T>['handleSpecificAnswer'],
): Promise<boolean> {
  const message = getMessage(ctx);

  switch (stepAnswer.type) {
    case 'union':
      return handleAnswerUnion(ctx, stepAnswer.field, stepAnswer.union, entity);
    case 'number':
      return handleNumberInput(ctx, stepAnswer.field, entity);
    case 'string':
      entity[stepAnswer.field] = message.text;
      return true;
    case 'boolean':
      return handleBooleanInput(ctx, stepAnswer.field, entity);
    case 'date':
      return handleDateInput(ctx, stepAnswer.field, entity);
    default:
      if (handleSpecificAnswer) {
        return handleSpecificAnswer.call(this, ctx, stepAnswer, entity);
      }
      await replyWithCancelButton(ctx, 'Error: Unsupported input type');
      return false;
  }
}
