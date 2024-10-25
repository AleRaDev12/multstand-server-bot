import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { UnifiedWizardHandlerOptions } from './types';
import { replyWithCancelButton } from './utils';
import { handleInputByType } from './handleInputByType';
import { SCENES } from '../../shared/scenes-wizards';
import { BaseEntity } from '../../entities/base.entity';
import { getMessage } from '../../shared/helpers';

type EntityOrRecord = BaseEntity | Record<string, any>;

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
    let targetEntity: EntityOrRecord;

    if (stepAnswer.linkedEntity === 'temp') {
      targetEntity =
        ctx.wizard.state.tempData || (ctx.wizard.state.tempData = {});
    } else if (stepAnswer.linkedEntity) {
      targetEntity = ctx.wizard.state[
        stepAnswer.linkedEntity
      ] as EntityOrRecord;
    } else {
      targetEntity = entity;
    }

    const result = await handleInputByType(
      ctx,
      stepAnswer,
      targetEntity,
      handleSpecificAnswer as (
        ctx: CustomWizardContext,
        stepAnswer: WizardStepType,
        entity: EntityOrRecord,
      ) => Promise<boolean>,
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
