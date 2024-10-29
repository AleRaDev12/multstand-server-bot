import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/types';
import { Transaction } from './transaction.entity';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { TransactionOrderAddWizard } from './transaction-order-add.wizard';
import { sendMessage } from '../../../shared/sendMessages';
import {
  INCORRECT_ENTER_BOOLEAN_MESSAGE,
  parseBooleanInput,
} from '../../../bot/wizard-step-handler/inputHandlers';

interface TransactionOrderWizardExtension {
  taxAccountId?: number;
  transferTax?: boolean;
}

type TransactionOrderContext = CustomWizardContext<
  any,
  TransactionOrderWizardExtension
>;

const ENTITY_NAME = 'transactionOrder';
const SELECT_TYPES: Record<string, AdditionalWizardSelections> = {
  ORDER: 'orderSelect',
  ACCOUNT: 'accountSelect',
  TAX_ACCOUNT: 'taxAccountSelect',
  TRANSFER_TAX: 'transferTaxSelect',
};

const STEPS: WizardStepType[] = [
  { message: 'Выберите заказ:', type: SELECT_TYPES.ORDER },
  {
    message: 'Дата транзакции (ГГГГ-ММ-ДД):',
    field: 'transactionDate',
    type: 'date',
  },
  { message: 'Сумма:', field: 'amount', type: 'number' },
  { message: 'Счёт:', type: SELECT_TYPES.ACCOUNT },
  { message: 'Описание:', field: 'description', type: 'string' },
  {
    message: 'Перенести 10% от суммы на счёт налогов?',
    type: SELECT_TYPES.TRANSFER_TAX,
  },
];

function getEntity(ctx: TransactionOrderContext): Transaction {
  return ctx.wizard.state[ENTITY_NAME];
}

function setEntity(ctx: TransactionOrderContext): void {
  ctx.wizard.state[ENTITY_NAME] = new Transaction();
}

async function save(
  this: TransactionOrderAddWizard,
  entity: Transaction,
  ctx?: TransactionOrderContext,
): Promise<Transaction> {
  const mainTransaction = await this.service.create(entity);

  if (ctx.wizard.state.transferTax) {
    const taxAmount = entity.amount * 0.1;
    await this.accountService.transferMoney({
      fromAccountId: entity.account.id,
      toAccountId: ctx.wizard.state.taxAccountId,
      amount: taxAmount,
      date: entity.transactionDate,
      description: `Налог 10% от транзакции ${mainTransaction.id}`,
    });
  }

  return mainTransaction;
}

async function print(
  ctx: TransactionOrderContext,
  entity: Transaction,
): Promise<void> {
  let message = `Транзакция на сумму ${entity.amount} для заказа ${entity.order.id} по счёту ${entity.account.name} добавлена.`;

  if (ctx.wizard.state.transferTax) {
    const taxAmount = entity.amount * 0.1;
    message += `\nТакже выполнен перевод ${taxAmount} на счёт налогов.`;
  }

  await sendMessage(ctx, message);
}

async function handleSpecificRequest(
  this: TransactionOrderAddWizard,
  ctx: TransactionOrderContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case SELECT_TYPES.ORDER: {
      const ordersList = (
        await this.orderService.getShortenedFormattedList()
      )?.join('\n');
      await replyWithCancelButton(ctx, `${stepRequest.message}\n${ordersList}`);
      return true;
    }
    case SELECT_TYPES.ACCOUNT:
    case SELECT_TYPES.TAX_ACCOUNT: {
      const accountsList = (await this.accountService.findAll())
        .map((account, index) => `${index + 1}. ${account.name}`)
        .join('\n');
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${accountsList}`,
      );
      return true;
    }
    case SELECT_TYPES.TRANSFER_TAX: {
      await replyWithCancelButton(ctx, `${stepRequest.message} (да/нет)`);
      return true;
    }
    default:
      return undefined;
  }
}

async function handleSpecificAnswer(
  this: TransactionOrderAddWizard,
  ctx: TransactionOrderContext,
  stepAnswer: WizardStepType,
  entity: Transaction,
): Promise<boolean> {
  const message = getMessage(ctx);

  switch (stepAnswer.type) {
    case SELECT_TYPES.ORDER:
      return handleOrderSelect.call(this, ctx, entity, message);
    case SELECT_TYPES.ACCOUNT:
      return handleAccountSelect.call(this, ctx, entity, message);
    case SELECT_TYPES.TAX_ACCOUNT:
      return handleTaxAccountSelect.call(this, ctx, message);
    case SELECT_TYPES.TRANSFER_TAX:
      return handleTransferTaxSelect.call(this, ctx, message);
    default:
      return true;
  }
}

async function handleOrderSelect(
  this: TransactionOrderAddWizard,
  ctx: TransactionOrderContext,
  entity: Transaction,
  message: { text: string },
): Promise<boolean> {
  const selectedNumber = parseInt(message.text);
  const orders = await this.orderService.findAll();
  const order = orders[selectedNumber - 1];
  if (!order) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }
  entity.order = order;
  return true;
}

async function handleAccountSelect(
  this: TransactionOrderAddWizard,
  ctx: TransactionOrderContext,
  entity: Transaction,
  message: { text: string },
): Promise<boolean> {
  const selectedNumber = parseInt(message.text);
  const accounts = await this.accountService.findAll();
  const account = accounts[selectedNumber - 1];
  if (!account) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }
  entity.account = account;
  return true;
}

async function handleTaxAccountSelect(
  this: TransactionOrderAddWizard,
  ctx: TransactionOrderContext,
  message: { text: string },
): Promise<boolean> {
  const selectedNumber = parseInt(message.text);
  const accounts = await this.accountService.findAll();
  const account = accounts[selectedNumber - 1];
  if (!account) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }
  ctx.wizard.state.taxAccountId = account.id;
  return true;
}

async function handleTransferTaxSelect(
  this: TransactionOrderAddWizard,
  ctx: TransactionOrderContext,
  message: { text: string },
): Promise<boolean> {
  const booleanValue = parseBooleanInput(message.text);

  if (booleanValue === null) {
    await replyWithCancelButton(ctx, INCORRECT_ENTER_BOOLEAN_MESSAGE);
    return false;
  }

  if (booleanValue)
    ctx.wizard.state.steps.push({
      message: 'Выберите счёт для налогов:',
      type: SELECT_TYPES.TAX_ACCOUNT,
    });

  ctx.wizard.state.transferTax = booleanValue;
  return true;
}

export const TransactionOrderWizardHandler = wizardStepHandler<
  Transaction,
  TransactionOrderWizardExtension
>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: STEPS,
  handleSpecificAnswer,
  handleSpecificRequest,
});
