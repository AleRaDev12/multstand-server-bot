import { CustomWizardContext } from '../../shared/interfaces';
import { handleAnswer } from './handleAnswer';
import { sendRequest } from './sendRequest';
import { BaseEntity } from '../../entities/base.entity';
import { UnifiedWizardHandlerOptions } from './types';

export function wizardStepHandler<T extends BaseEntity>(
  options: UnifiedWizardHandlerOptions<T>,
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
      descriptor.value = async function (ctx: CustomWizardContext) {
        const entity = getEntity(ctx);

        if (stepIndex === 1) {
          setEntity(ctx);
          ctx.wizard.state.steps = [...initialSteps];
          ctx.wizard.state.tempData = {};
        }

        const steps = ctx.wizard.state.steps;
        const stepForAnswerNumber = stepIndex - 2;
        const stepForRequestNumber = stepIndex - 1;
        const stepAnswer = steps[stepForAnswerNumber];
        const stepRequest = steps[stepForRequestNumber];

        if (stepAnswer) {
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

        if (stepRequest) {
          await sendRequest.call(
            this,
            ctx,
            stepRequest,
            stepIndex,
            handleSpecificRequest,
          );
        }
      };

      return descriptor;
    };
  };
}
