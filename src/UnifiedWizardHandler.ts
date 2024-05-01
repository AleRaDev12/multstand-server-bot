import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from './helpers';
import { CustomWizardContext } from './shared/interfaces';
import { SCENES } from './shared/wizards';

interface UnifiedWizardHandlerOptions<T> {
  getEntity: (ctx: CustomWizardContext) => T;
  setEntity: (ctx: CustomWizardContext) => void;
  save: (thisArg: any, entity: T) => Promise<T>;
  print: (ctx: CustomWizardContext, entity: T) => Promise<void>;
  steps: WizardStepType[];
  handleSpecificAnswer?: (
    ctx: CustomWizardContext,
    stepAnswer: WizardStepType,
    entity: T,
  ) => Promise<string | void>;
  handleSpecificRequest?: (
    ctx: CustomWizardContext,
    stepRequest: WizardStepType,
  ) => Promise<string | void>;
}

export function UnifiedWizardHandler<T>(
  options: UnifiedWizardHandlerOptions<T>,
) {
  const {
    getEntity,
    setEntity,
    save,
    print,
    steps,
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
        console.log('*-* -------------------');
        console.log('*-* stepIndex', stepIndex);

        const entity = getEntity(ctx);

        if (stepIndex === 1) {
          setEntity(ctx);
        }

        const stepForAnswerNumber = stepIndex - 2;
        const stepForRequestNumber = stepIndex - 1;

        const stepAnswer = steps[stepForAnswerNumber];
        const stepRequest = steps[stepForRequestNumber];
        console.log('*-* stepAnswer', stepAnswer);
        console.log('*-* stepRequest', stepRequest);

        const isAwaitAnswer = !!stepAnswer;
        if (isAwaitAnswer) {
          await handleAnswer(ctx, stepAnswer, entity, stepForAnswerNumber);
        }

        const isShouldSendRequest = !!stepRequest;
        if (isShouldSendRequest) {
          await sendRequest(ctx, stepRequest, stepIndex);
        }
      };

      async function handleAnswer(
        ctx: CustomWizardContext,
        stepAnswer: WizardStepType,
        entity: T,
        stepForAnswerNumber: number,
      ) {
        // TODO: update types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = ctx.update?.message as { text?: string };

        if (!msg?.text) {
          return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
        }

        switch (stepAnswer.type) {
          case 'union':
            const optionNumber = +msg.text;
            const unionKeys = Object.keys(stepAnswer.union);
            if (optionNumber < 1 || optionNumber > unionKeys.length) {
              return 'Некорректное значение. Пожалуйста, введите значение еще раз.';
            }
            entity[stepAnswer.field] = getValueUnionByIndex(
              stepAnswer.union,
              optionNumber - 1,
            );
            break;
          case 'number':
            const number = parseFloat(msg.text);
            if (!isNaN(number)) {
              entity[stepAnswer.field] = number;
            } else {
              return 'Введите корректное числовое значение.';
            }
            break;
          case 'boolean':
            const value = msg.text.toLowerCase();
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
                return `Введеите "да", "нет", "yes", "no", 1 или 0.`;
            }
            entity[stepAnswer.field] = booleanValue;
            break;
          default:
            if (handleSpecificAnswer) {
              await handleSpecificAnswer(ctx, stepAnswer, entity);
            } else {
              return 'Ошибка';
            }
        }

        const isLastStep = stepForAnswerNumber === steps.length - 1;
        if (isLastStep) {
          console.log('*-* entity', entity);
          const creatingEntity = await save.call(this, entity);
          await print(ctx, creatingEntity);

          await ctx.scene.leave();
          await ctx.scene.enter(SCENES.ENTERING);
        }
      }

      async function sendRequest(
        ctx: CustomWizardContext,
        stepRequest: WizardStepType,
        stepIndex: number,
      ) {
        console.log('*-* send text');

        if (handleSpecificRequest) {
          await handleSpecificRequest(ctx, stepRequest);
        }

        ctx.wizard.next();
        return generateMessage(steps[stepIndex - 1]);
      }

      return descriptor;
    };
  };
}
