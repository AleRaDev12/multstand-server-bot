import { SCENES } from '../../shared/scenes-wizards';
import { BaseEntity } from '../../entities/base.entity';
import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { UnifiedWizardHandlerOptions } from './types';
import { handleInputByType } from './handleInputByType';
import { getMessage } from '../../shared/helpers';
import { replyWithCancelButton } from './utils';

export async function handleAnswer<T extends BaseEntity>(
  this: any,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: T,
  stepForAnswerNumber: number,
  handleSpecificAnswer: UnifiedWizardHandlerOptions<T>['handleSpecificAnswer'],
  save: UnifiedWizardHandlerOptions<T>['save'],
  print: UnifiedWizardHandlerOptions<T>['print'],
): Promise<boolean> {
  const message = getMessage(ctx);

  if (!message?.text) {
    await replyWithCancelButton(
      ctx,
      'Invalid input. Please enter the value again.',
    );
    return false;
  }

  if (message.text === '-' && entity instanceof BaseEntity) {
    const isNullable = (entity.constructor as typeof BaseEntity).nullable[
      stepAnswer.field
    ];

    if (!isNullable) {
      await replyWithCancelButton(
        ctx,
        'Invalid input. The field cannot be empty. Please enter a value again.',
      );
      return false;
    }
  }

  if (message.text !== '-') {
    const result = await handleInputByType(
      ctx,
      stepAnswer,
      entity,
      handleSpecificAnswer,
    );
    if (!result) return false;
  }

  const steps = ctx.wizard.state.steps;
  const isLastStep = stepForAnswerNumber === steps.length - 1;
  if (isLastStep) {
    const creatingEntity = await save.call(this, entity, ctx);
    await print.call(this, ctx, creatingEntity);

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }

  return true;
}
