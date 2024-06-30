import {
  CustomWizardContext,
  AdditionalWizardSelections,
  WizardStepType,
} from '../../../shared/interfaces';
import { Transaction } from './transaction.entity';

import { TransactionOrderAddWizard } from './add-transaction-order.wizard';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';

const entityName = 'transactionOrder';
const orderSelectType: AdditionalWizardSelections = 'orderSelect';
const accountSelectType: AdditionalWizardSelections = 'accountSelect';

const steps: WizardStepType[] = [
  { message: 'Выберите заказ:', type: orderSelectType },
  {
    message: 'Дата транзакции (ГГГГ-ММ-ДД):',
    field: 'transactionDate',
    type: 'date',
  },
  {
    message: 'Сумма:',
    field: 'amount',
    type: 'number',
  },
  { message: 'Счёт:', type: accountSelectType },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Transaction {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Transaction();
}

async function save(this: TransactionOrderAddWizard, entity: Transaction) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: Transaction,
): Promise<void> {
  await ctx.reply(
    `Транзакция на сумму ${entity.amount} для заказа ${entity.order.id} по счёту ${entity.account.name} добавлена.`,
  );
}

async function handleSpecificRequest(
  this: TransactionOrderAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case orderSelectType: {
      const ordersList = (
        await this.orderService.getShortenedFormattedList()
      )?.join('\n');
      await replyWithCancelButton(ctx, `${stepRequest.message}\n${ordersList}`);
      return true;
    }
    case accountSelectType: {
      const accountsList = (await this.accountService.findAll())
        .map((account, index) => `${index + 1}. ${account.name}`)
        .join('\n');
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${accountsList}`,
      );
      return true;
    }
    default:
      return false;
  }
}

async function handleSpecificAnswer(
  this: TransactionOrderAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: Transaction,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case orderSelectType: {
      const message = getMessage(ctx);
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
    case accountSelectType: {
      const message = getMessage(ctx);
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
    default:
      return true;
  }
}

export const TransactionOrderWizardHandler = wizardStepHandler<Transaction>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
