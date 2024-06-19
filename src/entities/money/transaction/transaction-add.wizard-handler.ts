import {
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { UnifiedWizardHandler } from '../../../UnifiedWizardHandler';
import { TransactionAddWizard } from './transaction-add.wizard';
import { Transaction } from './transaction.entity';

const entityName = 'transaction';

const steps: WizardStepType[] = [
  { message: 'Дата транзакции:', field: 'transactionDate', type: 'date' },
  { message: 'Сумма:', field: 'amount', type: 'number' },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Transaction {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Transaction();
}

async function save(this: TransactionAddWizard, entity: Transaction) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: Transaction,
): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

export const TransactionAddWizardHandler = UnifiedWizardHandler<Transaction>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});
