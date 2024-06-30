import {
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { AccountAddWizard } from './account-add.wizard';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { Account } from './account.entity';

const entityName = 'account';

const steps: WizardStepType[] = [
  { message: 'Название счёта:', field: 'name', type: 'string' },
  { message: 'Описание счёта:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Account {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Account();
}

async function save(this: AccountAddWizard, entity: Account) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Account): Promise<void> {
  await ctx.reply(`Добавлено`);
}

export const AccountAddWizardHandler = wizardStepHandler<Account>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
});
