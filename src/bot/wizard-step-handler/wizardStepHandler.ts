import { CustomWizardContext } from '../../shared/interfaces';
import { handleAnswer } from './handleAnswer';
import { sendRequest } from './sendRequest';
import { BaseEntity } from '../../entities/base.entity';
import { UnifiedWizardHandlerOptions } from './types';
import { sendMessage } from '../../shared/sendMessages';

export function wizardStepHandler<T extends BaseEntity, E = object>(
  options: UnifiedWizardHandlerOptions<T, E>,
) {
  const {
    getEntity,
    setEntity,
    save,
    print,
    initialSteps,
    handleSpecificAnswer,
    handleSpecificRequest,
  } = options;

  return function (stepIndex: number) {
    return function (
      _target: any,
      _propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      descriptor.value = async function (ctx: CustomWizardContext<any, E>) {
        const entity = getEntity(ctx);
        let currentStep = stepIndex;

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

        if (stepIndex === 1) {
          setEntity(ctx);
          ctx.wizard.state.steps = [...initialSteps];
          ctx.wizard.state.tempData = {};
        }

        let steps = ctx.wizard.state.steps;
        const stepForAnswerNumber = currentStep - 2;
        const stepAnswer = steps[stepForAnswerNumber];

        if (stepAnswer && !isBackAction) {
          const isOk = await handleAnswer.call(
            this,
            ctx,
            stepAnswer,
            entity,
            stepForAnswerNumber,
            handleSpecificAnswer ? handleSpecificAnswer.bind(this) : undefined,
            save.bind(this),
            print.bind(this),
          );
          if (!isOk) return;
        }

        steps = ctx.wizard.state.steps;
        const stepForRequestNumber = currentStep - 1;
        const stepRequest = steps[stepForRequestNumber];

        if (stepRequest) {
          await sendRequest.call(
            this,
            ctx,
            stepRequest,
            currentStep,
            handleSpecificRequest,
          );
        }
      };

      return descriptor;
    };
  };
}
