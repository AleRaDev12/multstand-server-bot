import {
  CustomWizardContext,
  AdditionalWizardSelections,
  WizardStepType,
} from '../../../shared/interfaces';
import { TransactionAddWizard } from './transaction-add.wizard';
import { Transaction } from './transaction.entity';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage } from '../../../shared/senMessages';

const entityName = 'transaction';
const accountSelect: AdditionalWizardSelections = 'accountSelect';

const steps: WizardStepType[] = [
  { message: 'Дата транзакции:', field: 'transactionDate', type: 'date' },
  {
    message: 'Сумма (укажите -, если это расход):',
    field: 'amount',
    type: 'number',
  },
  { message: 'Счёт:', type: accountSelect },
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
  await sendMessage(ctx, `Добавлено`);
}

async function handleSpecificRequest(
  this: TransactionAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case accountSelect: {
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
  this: TransactionAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: Transaction,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case accountSelect: {
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

export const TransactionAddWizardHandler = wizardStepHandler<Transaction>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
