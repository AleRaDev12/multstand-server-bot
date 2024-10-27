import { CustomWizardContext, WizardStepType } from '../../shared/types';
import { BaseEntity } from '../../entities/base.entity';
import { sendMessage } from '../../shared/sendMessages';
import {
  CustomWizardHandlerOptions,
  EntityWizardHandlerOptions,
  UnifiedWizardHandlerOptions,
} from './types';
import { SCENES } from '../../shared/scenes-wizards';
import { getMessage } from '../../shared/helpers';
import { handleInputByType } from './handleInputByType';
import { replyWithCancelButton } from './utils';

async function handleStandardFieldAnswer(
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: BaseEntity,
): Promise<boolean> {
  if (!stepAnswer.field) return true;

  const message = getMessage(ctx);
  if (!message?.text) {
    await sendMessage(ctx, 'Invalid input. Please enter the value again.');
    return false;
  }

  if (message.text === '-') {
    const isNullable = (entity.constructor as typeof BaseEntity).nullable[
      stepAnswer.field
    ];

    if (!isNullable) {
      await sendMessage(
        ctx,
        'Invalid input. The field cannot be empty. Please enter a value again.',
      );
      return false;
    }

    entity[stepAnswer.field] = null;
    return true;
  }

  // Используем существующую логику обработки типов
  return handleInputByType(
    ctx,
    stepAnswer,
    entity,
    undefined, // здесь не нужен специфичный обработчик
  );
}

async function handleStandardStepRequest(
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  console.log('*-* Standard request handler:', {
    hasMessage: !!stepRequest.message,
    message: stepRequest.message,
    type: stepRequest.type,
  });

  if (!stepRequest.message) {
    return false;
  }

  try {
    await replyWithCancelButton(ctx, stepRequest.message);
    return true;
  } catch (error) {
    console.error('*-* Error sending message:', error);
    return false;
  }
}

function isEntityOptions<T>(
  options: EntityWizardHandlerOptions<any> | CustomWizardHandlerOptions<T>,
): options is EntityWizardHandlerOptions<BaseEntity> {
  return 'getEntity' in options && 'setEntity' in options;
}

export function wizardStepHandler<T extends BaseEntity, E = object>(
  options: UnifiedWizardHandlerOptions<T, E>,
): any;
export function wizardStepHandler<T extends BaseEntity>(
  options: EntityWizardHandlerOptions<T>,
): any;
export function wizardStepHandler<T>(
  options: CustomWizardHandlerOptions<T>,
): any;
export function wizardStepHandler<T>(
  options:
    | UnifiedWizardHandlerOptions<any>
    | EntityWizardHandlerOptions<any>
    | CustomWizardHandlerOptions<T>,
) {
  return function (stepIndex: number) {
    return function (
      _target: any,
      _propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (ctx: CustomWizardContext) {
        let state: T;

        // Initialize state on first step
        if (stepIndex === 1) {
          if ('initState' in options) {
            state = (options as CustomWizardHandlerOptions<T>).initState();
            ctx.wizard.state.wizardState = state;
            console.log(
              '*-* ctx.wizard.state.wizardState ctx',
              ctx.session.userRole,
            );
          } else {
            const entityOptions = options as
              | UnifiedWizardHandlerOptions<any>
              | EntityWizardHandlerOptions<any>;
            entityOptions.setEntity.call(this, ctx);
            state = entityOptions.getEntity.call(this, ctx) as T;
          }
          ctx.wizard.state.steps = [...options.initialSteps];
        } else {
          if ('initState' in options) {
            state = ctx.wizard.state.wizardState;
          } else {
            const entityOptions = options as
              | UnifiedWizardHandlerOptions<any>
              | EntityWizardHandlerOptions<any>;
            state = entityOptions.getEntity.call(this, ctx) as T;
          }
        }

        console.log('*-* state', state);

        let currentStep = stepIndex;
        const steps = ctx.wizard.state.steps;

        // Handle back action
        const isBackAction =
          ctx.message && 'text' in ctx.message && ctx.message.text === '<';
        if (isBackAction) {
          if (stepIndex === 2) {
            await sendMessage(ctx, 'Вы уже на первом шаге. Повторите ввод.');
            currentStep = stepIndex - 1;
            ctx.wizard.back();
          } else {
            currentStep = stepIndex - 2;
            ctx.wizard.back();
            ctx.wizard.back();
          }
        }

        const stepForAnswerNumber = currentStep - 2;
        const stepAnswer = steps[stepForAnswerNumber];

        // Handle answer from previous step
        if (stepAnswer && !isBackAction) {
          let isValid = true;

          // Для сущностей используем стандартный обработчик полей
          if (stepAnswer.field && 'getEntity' in options) {
            isValid = await handleStandardFieldAnswer(
              ctx,
              stepAnswer,
              state as unknown as BaseEntity,
            );
          }

          // Если есть специфичный обработчик, используем его
          if (isValid && options.handleSpecificAnswer) {
            isValid = await options.handleSpecificAnswer.call(
              this,
              ctx,
              stepAnswer,
              state,
            );
          }

          if (!isValid) return;
        }

        // Check if wizard is complete
        const isLastStep = currentStep === steps.length + 1;
        if (isLastStep) {
          console.log('*-* lastStep state', state);
          await options.save.call(this, state, ctx);
          await options.print.call(this, ctx, state);

          // Clear wizard state
          delete ctx.wizard.state.wizardState;
          delete ctx.wizard.state.steps;

          await ctx.scene.leave();
          await ctx.scene.enter(SCENES.MENU);
          return;
        }

        // Handle next step request
        const stepForRequestNumber = currentStep - 1;
        const stepRequest = steps[stepForRequestNumber];

        if (stepRequest) {
          console.log('*-* Processing step request:', {
            currentStep,
            stepForRequestNumber,
            stepRequest,
            hasSpecificHandler: !!options.handleSpecificRequest,
          });

          let result: boolean;

          if (options.handleSpecificRequest) {
            const specificResult = await options.handleSpecificRequest.call(
              this,
              ctx,
              stepRequest,
            );

            // Если специфичный обработчик вернул undefined - используем стандартный
            if (specificResult === undefined) {
              result = await handleStandardStepRequest(ctx, stepRequest);
            } else {
              result = specificResult;
            }
          } else {
            result = await handleStandardStepRequest(ctx, stepRequest);
          }

          console.log('*-* Final handler result:', result);

          if (result) {
            ctx.wizard.next();
          }
        }
      };

      return descriptor;
    };
  };
}
