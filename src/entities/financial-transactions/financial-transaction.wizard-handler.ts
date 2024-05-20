import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';
import { FinancialTransaction } from './financial-transaction.entity';
import { FinancialTransactionAddWizard } from './financial-transaction-add.wizard';

const entityName = 'financialTransaction';

const steps: WizardStepType[] = [
  { message: 'Дата транзакции:', field: 'transactionDate', type: 'date' },
  { message: 'Сумма:', field: 'amount', type: 'number' },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): FinancialTransaction {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new FinancialTransaction();
}

async function save(
  this: FinancialTransactionAddWizard,
  entity: FinancialTransaction,
) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: FinancialTransaction,
): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

export const FinancialTransactionWizardHandler =
  UnifiedWizardHandler<FinancialTransaction>({
    getEntity,
    setEntity,
    save,
    print,
    steps,
  });
