import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';
import { Money } from './money.entity';
import { MoneyAddWizard } from './money-add.wizard';

const entityName = 'money';

const steps: WizardStepType[] = [
  { message: 'Дата транзакции:', field: 'transactionDate', type: 'date' },
  { message: 'Сумма:', field: 'amount', type: 'number' },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Money {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Money();
}

async function save(this: MoneyAddWizard, entity: Money) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Money): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

export const MoneyWizardHandler = UnifiedWizardHandler<Money>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});
