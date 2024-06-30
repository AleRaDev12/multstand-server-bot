import {
  generateMessage,
  getMessage,
  getValueUnionByIndex,
} from './shared/helpers';
import { CustomWizardContext, WizardStepType } from './shared/interfaces';
import { SCENES } from './shared/scenes-wizards';
import { Markup } from 'telegraf';
import { BaseEntity } from './entities/base.entity';

interface UnifiedWizardHandlerOptions<T> {
  getEntity: (ctx: CustomWizardContext) => T;
  setEntity: (ctx: CustomWizardContext) => void;
  save: (thisArg: any, entity: T) => Promise<T | undefined | void>;
  print: (ctx: CustomWizardContext, entity: T) => Promise<void>;
  initialSteps: WizardStepType[];
  handleSpecificAnswer?: (
    ctx: CustomWizardContext,
    stepAnswer: WizardStepType,
    entity: T,
  ) => Promise<boolean>;
  handleSpecificRequest?: (
    ctx: CustomWizardContext,
    stepRequest: WizardStepType,
  ) => Promise<boolean>;
}

export function UnifiedWizardHandler<T extends BaseEntity>(
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
        console.log('*-* -------------------');
        console.log('*-* stepIndex', stepIndex);

        const entity = getEntity(ctx);

        if (stepIndex === 1) {
          setEntity(ctx);
          ctx.wizard.state.steps = [...initialSteps];
        }

        const steps = ctx.wizard.state.steps;

        const stepForAnswerNumber = stepIndex - 2;
        const stepForRequestNumber = stepIndex - 1;

        const stepAnswer = steps[stepForAnswerNumber];
        const stepRequest = steps[stepForRequestNumber];
        console.log('*-* stepAnswer', stepAnswer);
        console.log('*-* stepRequest', stepRequest);

        const isAwaitAnswer = !!stepAnswer;
        if (isAwaitAnswer) {
          const isOk = await handleAnswer.call(
            this,
            ctx,
            stepAnswer,
            entity,
            stepForAnswerNumber,
          );
          if (!isOk) return;
        }

        const isShouldSendRequest = !!stepRequest;
        if (isShouldSendRequest) {
          await sendRequest.call(this, ctx, stepRequest, stepIndex);
        }
      };

      async function handleAnswer(
        ctx: CustomWizardContext,
        stepAnswer: WizardStepType,
        entity: T,
        stepForAnswerNumber: number,
      ): Promise<boolean> {
        const message = getMessage(ctx);

        if (!message?.text) {
          await replyWithCancelButton(
            ctx,
            'Некорректный ввод. Пожалуйста, введите значение еще раз.',
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
              'Некорректный ввод. Поле не может быть пустым. Пожалуйста, введите значение ещё раз.',
            );
            return false;
          }
        }

        if (message.text !== '-') {
          switch (stepAnswer.type) {
            case 'union':
              const result = await handleAnswerUnion(
                ctx,
                stepAnswer.field,
                stepAnswer.union,
                entity,
              );
              if (!result) return false;
              break;
            case 'number':
              const number = parseFloat(message.text);
              if (!isNaN(number)) {
                entity[stepAnswer.field] = number;
              } else {
                await replyWithCancelButton(
                  ctx,
                  'Введите корректное числовое значение.',
                );
                return false;
              }
              break;
            case 'string':
              entity[stepAnswer.field] = message.text;
              break;
            case 'boolean':
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
                    `Введите "да", "нет", "yes", "no", 1 или 0.`,
                  );
                  return false;
              }
              entity[stepAnswer.field] = booleanValue;
              break;
            case 'date':
              const date = Date.parse(message.text);
              if (!isNaN(date)) {
                entity[stepAnswer.field] = new Date(date);
              } else {
                await replyWithCancelButton(ctx, 'Введите корректную дату.');
                return false;
              }
              break;
            default:
              if (handleSpecificAnswer) {
                const result = await handleSpecificAnswer.call(
                  this,
                  ctx,
                  stepAnswer,
                  entity,
                );
                return result;
              } else {
                await replyWithCancelButton(ctx, 'Ошибка 1');
                return false;
              }
          }
        }

        const steps = ctx.wizard.state.steps;
        const isLastStep = stepForAnswerNumber === steps.length - 1;
        if (isLastStep) {
          const creatingEntity = await save.call(this, entity);
          await print(ctx, creatingEntity);

          await ctx.scene.leave();
          await ctx.scene.enter(SCENES.MENU);
        }

        return true;
      }

      async function sendRequest(
        ctx: CustomWizardContext,
        stepRequest: WizardStepType,
        stepIndex: number,
      ): Promise<boolean> {
        const steps = ctx.wizard.state.steps;

        switch (stepRequest.type) {
          case 'union':
          case 'number':
          case 'string':
          case 'boolean':
          case 'date': {
            await replyWithCancelButton(
              ctx,
              generateMessage(steps[stepIndex - 1]),
            );
            ctx.wizard.next();
            return true;
          }
          default: {
            if (handleSpecificRequest) {
              const result = await handleSpecificRequest.call(
                this,
                ctx,
                stepRequest,
              );
              if (result) ctx.wizard.next();
              return result;
            } else {
              await replyWithCancelButton(ctx, 'Ошибка 2');
              return false;
            }
          }
        }
      }

      return descriptor;
    };
  };
}

export async function replyWithCancelButton(
  ctx: CustomWizardContext,
  message: string,
) {
  await ctx.reply(
    message,
    Markup.inlineKeyboard([Markup.button.callback('Отмена', 'cancel')]),
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
      'Некорректное значение. Пожалуйста, введите значение еще раз.',
    );
    return false;
  }

  entity[field] = getValueUnionByIndex(union, optionNumber - 1);

  return true;
}
