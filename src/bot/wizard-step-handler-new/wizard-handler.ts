import {
  PathsToStringPropsWithDepth,
  PathValue,
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
import { replyWithCancelButton } from '../wizard-step-handler/utils';
import { SCENES } from '../../shared/scenes-wizards';
import { GLOBAL_ACTION } from '../constants';
import { format } from 'date-fns';
import { getMessageText } from '../../shared/helpers';

const COMMAND_SYMBOLS = {
  back: '<',
  skip: '-',
  cancel: '.',
};

export function wizardStepHandler<T, W>(config: WizardHandlerConfig<T, W>) {
  return function (stepNumber: number) {
    return function (
      _target: any,
      _propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      descriptor.value = async function (
        this: W,
        ctx: StepWizardContext<T, W>,
      ) {
        try {
          let isShouldContinue: boolean;

          isShouldContinue = !(await isCancellation(ctx));
          if (!isShouldContinue) {
            await exitWizard(ctx, config, this, 'Отменено. Выходим.', true);
            return;
          }

          if (isFirstStep(stepNumber)) {
            await handleFirstStep(ctx, config, this);
            return;
          }

          isShouldContinue = await handleStepAnswer(ctx, this);
          if (!isShouldContinue) return;

          if (isWizardCompleted(ctx)) {
            await exitWizard(ctx, config, this);
            return;
          }

          const isRequestSent = await sendRequestNextStep(ctx, this);
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

export function getProcessingAnswerStep<T, W>(
  steps: WizardStep<T, W>[],
  cursor: number,
): WizardStep<T, W> {
  return steps[cursor - 1];
}

async function handleFirstStep<T, W>(
  ctx: StepWizardContext<T, W>,
  config: WizardHandlerConfig<T, W>,
  wizard: W,
): Promise<void> {
  ctx.wizard.state.data = {
    ...ctx.wizard.state.data,
    ...createWizardData(config.initialSteps),
  };

  if (config.beforeFirstStep) {
    await config.beforeFirstStep(wizard, ctx);
  }

  const firstStep = getWizardSteps(ctx)[0];
  await ctx.reply(
    `Команды:\n${COMMAND_SYMBOLS.back} Ввернуться на предыдущий шаг\n${COMMAND_SYMBOLS.skip} Пропустить необязательное поле\n${COMMAND_SYMBOLS.cancel} Прервать`,
  );
  await sendStepRequest(ctx, firstStep, wizard);
  ctx.wizard.next();
}

async function handleStepAnswer<T, W>(
  ctx: StepWizardContext<T, W>,
  wizard: W,
): Promise<boolean> {
  const isMovedBack = await handleMoveBack(ctx);
  if (isMovedBack) {
    return true;
  }

  const isSkipped = await handleSkip(ctx);
  if (isSkipped) {
    return true;
  }

  const isValueAnswerHandledCorrectly = await handleValueAnswer(ctx, wizard);
  if (!isValueAnswerHandledCorrectly) {
    await replyWithCancelButton(ctx, 'Некорректный ввод. Повторите.');
    return false;
  }

  return true;
}

async function handleValueAnswer<T, W>(
  ctx: StepWizardContext<T, W>,
  wizard: W,
): Promise<boolean> {
  const processingAnswerStep = getProcessingAnswerStep(
    getWizardSteps(ctx),
    ctx.wizard.cursor,
  );

  const text = getMessageText(ctx);

  if ('handler' in processingAnswerStep) {
    return processingAnswerStep.handler(wizard, ctx, 'answer');
  }

  const validation = validateAndParseStepInput(processingAnswerStep, text);
  if (!validation.isValid) {
    return false;
  }

  if (validation.value && 'field' in processingAnswerStep) {
    setFieldValue(ctx, processingAnswerStep.field, validation.value);
  }

  return true;
}

export function setFieldValue<T, W>(
  ctx: StepWizardContext<T, W>,
  field: PathsToStringPropsWithDepth<T>,
  value: PathValue<T, PathsToStringPropsWithDepth<T>>,
): void {
  setValueByPath(ctx.wizard.state.data.values, field, value);
}

export function getFieldValue<T, W>(
  ctx: StepWizardContext<T, W>,
  field: PathsToStringPropsWithDepth<T>,
): PathValue<T, PathsToStringPropsWithDepth<T>> | undefined {
  const paths = field.split('.');
  let value: any = ctx.wizard.state.data.values;

  for (const path of paths) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[path];
  }

  return value as PathValue<T, PathsToStringPropsWithDepth<T>>;
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

async function sendStepRequest<T, W>(
  ctx: StepWizardContext<T, W>,
  step: WizardStep<T, W>,
  wizard: W,
): Promise<boolean> {
  if ('handler' in step) {
    await replyWithCancelButton(ctx, step.message);
    return step.handler(wizard, ctx, 'request');
  }

  await replyWithCancelButton(
    ctx,
    `${step.message}\n${getTypeDescription(step.type)}${step.required ? '' : '\nНеобязательное - можно пропустить'}`,
  );

  return true;
}

async function exitWizard<T, W>(
  ctx: StepWizardContext<T, W>,
  config: WizardHandlerConfig<T, W>,
  wizard: W,
  lastMessage?: string,
  isAborted?: boolean,
): Promise<void> {
  if (!isAborted) await config.afterLastStep(wizard, ctx);
  if (lastMessage) await ctx.reply(lastMessage);
  await ctx.scene.leave();
  await ctx.scene.enter(SCENES.MENU);
}

async function handleMoveBack<T, W>(
  ctx: StepWizardContext<T, W>,
): Promise<boolean> {
  const messageText = getMessageText(ctx);

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

async function handleSkip<T, W>(
  ctx: StepWizardContext<T, W>,
): Promise<boolean> {
  const messageText = getMessageText(ctx);
  return messageText === COMMAND_SYMBOLS.skip;
}

async function isCancellation<T, W>(
  ctx: StepWizardContext<T, W>,
): Promise<boolean> {
  const messageText = getMessageText(ctx);
  if (messageText === COMMAND_SYMBOLS.cancel) return true;

  const isWithoutCommand = !ctx.callbackQuery || !('data' in ctx.callbackQuery);
  if (isWithoutCommand) {
    return false;
  }

  const actionCommand = ctx.callbackQuery.data;

  return actionCommand === GLOBAL_ACTION.CANCEL;
}

export function isWizardCompleted<T, W>(ctx: StepWizardContext<T, W>): boolean {
  const cursor = ctx.wizard.cursor - 1;
  const stepsLength = getWizardSteps(ctx).length;

  return cursor === stepsLength - 1;
}

async function sendRequestNextStep<T, W>(
  ctx: StepWizardContext<T, W>,
  wizard: W,
) {
  const step = getWizardSteps(ctx)[ctx.wizard.cursor];
  return await sendStepRequest(ctx, step, wizard);
}

export function getWizardSteps<T, W>(ctx: StepWizardContext<T, W>) {
  return ctx.wizard.state.data.meta.steps;
}
