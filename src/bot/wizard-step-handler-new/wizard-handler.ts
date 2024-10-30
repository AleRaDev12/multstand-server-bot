import {
  WIZARD_STEP_VALUE_TYPE,
  WizardHandlerConfig,
  WizardStep,
} from './types';
import { StepWizardContext } from './wizard-context-types';
import {
  createWizardData,
  validateAndParseStepInput,
} from './wizard-operations';
import { setValueByPath } from './utils';
import { getMessageText } from './message-utils';
import { replyWithCancelButton } from '../wizard-step-handler/utils';
import { SCENES } from '../../shared/scenes-wizards';
import { GLOBAL_ACTION } from '../constants';
import { format } from 'date-fns';

const COMMAND_SYMBOLS = {
  back: '<',
  skip: '-',
  cancel: '.',
};

export function wizardStepHandler<T>(config: WizardHandlerConfig<T>) {
  return function (stepNumber: number) {
    return function (
      _target: any,
      _propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      descriptor.value = async function (ctx: StepWizardContext<T>) {
        try {
          let isShouldContinue = true;

          isShouldContinue = !(await isCancellation(ctx));
          if (!isShouldContinue) {
            await exitWizard(ctx, config, 'Отменено. Выходим.', true);
            return;
          }

          if (isFirstStep(stepNumber)) {
            await handleFirstStep(ctx, config);
            return;
          }

          isShouldContinue = await handleStepAnswer(ctx);
          if (!isShouldContinue) return;

          if (isWizardCompleted(ctx)) {
            await exitWizard(ctx, config);
            return;
          }

          const isRequestSent = await sendRequestNextStep(ctx);
          if (!isRequestSent) {
            await ctx.reply(
              'Критическая ошибка при попытке отправки запроса. Выходим.',
            );
            return;
          }

          ctx.wizard.next();
        } catch (error) {
          await ctx.reply(`Error: ${error.message}`);
          await ctx.scene.leave();
        }
      };

      return descriptor;
    };
  };
}

export function isFirstStep(stepNumber: number): boolean {
  return stepNumber === 1;
}

export function getProcessingAnswerStep<T>(
  steps: WizardStep<T>[],
  cursor: number,
): WizardStep<T> {
  return steps[cursor - 1];
}

async function handleFirstStep<T>(
  ctx: StepWizardContext<T>,
  config: WizardHandlerConfig<T>,
): Promise<void> {
  ctx.wizard.state.data = {
    ...ctx.wizard.state.data,
    ...createWizardData(config.initialSteps),
  };

  if (config.beforeFirstStep) {
    await config.beforeFirstStep(ctx);
  }

  const firstStep = ctx.wizard.state.data.meta.steps[0];
  await ctx.reply(
    `Команды:\n${COMMAND_SYMBOLS.back} Ввернуться на предыдущий шаг\n${COMMAND_SYMBOLS.skip} Пропустить необязательное поле\n${COMMAND_SYMBOLS.cancel} Прервать`,
  );
  await sendStepRequest(ctx, firstStep);
  ctx.wizard.next();
}

async function handleStepAnswer<T>(
  ctx: StepWizardContext<T>,
): Promise<boolean> {
  const isMovedBack = await handleMoveBack(ctx);
  if (isMovedBack) {
    return true;
  }

  const isSkipped = await handleSkip(ctx);
  if (isSkipped) {
    return true;
  }

  const isValueAnswerHandledCorrectly = await handleValueAnswer(ctx);
  if (!isValueAnswerHandledCorrectly) {
    await replyWithCancelButton(ctx, 'Некорректный ввод. Повторите.');
    return false;
  }

  return true;
}

async function handleValueAnswer<T>(
  ctx: StepWizardContext<T>,
): Promise<boolean> {
  const processingAnswerStep = getProcessingAnswerStep(
    ctx.wizard.state.data.meta.steps,
    ctx.wizard.cursor,
  );

  const text = getMessageText(ctx.message);

  if ('handler' in processingAnswerStep) {
    return processingAnswerStep.handler(ctx, 'answer');
  }

  const validation = validateAndParseStepInput(processingAnswerStep, text);
  if (!validation.isValid) {
    return false;
  }

  if (validation.value && 'field' in processingAnswerStep) {
    setValueByPath(
      ctx.wizard.state.data.values,
      processingAnswerStep.field,
      validation.value,
    );
  }

  return true;
}

const getTypeDescription = (type: WIZARD_STEP_VALUE_TYPE) => {
  if (type === 'boolean') return 'Тип: флаг (да/нет 1/0 yes/no)';
  if (type === 'number') return 'Тип: число';

  const today = new Date();
  const monthName = format(today, 'MMMM');
  if (type === 'date')
    return `Тип: дата\nВ формате "ГГГГ-ММ-ДД"\nИли день текущего месяца (текущий месяц сервера — ${monthName})`;

  if (type === 'string') return 'Тип: строка';
};

async function sendStepRequest<T>(
  ctx: StepWizardContext<T>,
  step: WizardStep<T>,
): Promise<boolean> {
  if ('handler' in step) {
    await replyWithCancelButton(ctx, step.message);
    return step.handler(ctx, 'request');
  }

  await replyWithCancelButton(
    ctx,
    `${step.message}\n${getTypeDescription(step.type)}${step.required ? '' : '\nНеобязательное - можно пропустить'}`,
  );

  return true;
}

async function exitWizard<T>(
  ctx: StepWizardContext<T>,
  config: WizardHandlerConfig<T>,
  lastMessage?: string,
  isAborted?: boolean,
): Promise<void> {
  if (!isAborted) await config.afterLastStep(ctx);
  if (lastMessage) await ctx.reply(lastMessage);
  await ctx.scene.leave();
  await ctx.scene.enter(SCENES.MENU);
}

async function handleMoveBack<T>(ctx: StepWizardContext<T>): Promise<boolean> {
  const messageText = getMessageText(ctx.message);

  const isBackCommand = messageText === COMMAND_SYMBOLS.back;
  const canMoveBack = ctx.wizard.cursor > 1;

  if (isBackCommand && !canMoveBack) {
    await ctx.reply(
      'Вы уже на первом шаге, нет возможности перейти к предыдущему.',
    );
    ctx.wizard.back();
    return true;
  }

  if (isBackCommand && canMoveBack) {
    ctx.wizard.back();
    ctx.wizard.back();
    return true;
  }

  return false;
}

async function handleSkip<T>(ctx: StepWizardContext<T>): Promise<boolean> {
  const messageText = getMessageText(ctx.message);
  return messageText === COMMAND_SYMBOLS.skip;
}

async function isCancellation<T>(ctx: StepWizardContext<T>): Promise<boolean> {
  const messageText = getMessageText(ctx.message);
  if (messageText === COMMAND_SYMBOLS.cancel) return true;

  const isWithoutCommand = !ctx.callbackQuery || !('data' in ctx.callbackQuery);
  if (isWithoutCommand) {
    return false;
  }

  const actionCommand = ctx.callbackQuery.data;

  return actionCommand === GLOBAL_ACTION.CANCEL;
}

export function isWizardCompleted<T>(ctx: StepWizardContext<T>): boolean {
  const cursor = ctx.wizard.cursor - 1;
  const stepsLength = ctx.wizard.state.data.meta.steps.length;

  return cursor === stepsLength - 1;
}

async function sendRequestNextStep<T>(ctx: StepWizardContext<T>) {
  const step = ctx.wizard.state.data.meta.steps[ctx.wizard.cursor];
  return await sendStepRequest(ctx, step);
}
