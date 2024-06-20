import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../../shared/interfaces';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { TransactionAddWizard } from './transaction-add.wizard';
import { Transaction } from './transaction.entity';

const entityName = 'transaction';
const accountSelectType: DbEntities = 'accountSelect';

const steps: WizardStepType[] = [
  { message: 'Дата транзакции:', field: 'transactionDate', type: 'date' },
  {
    message: 'Сумма (укажите -, если это расход):',
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

async function save(this: TransactionAddWizard, entity: Transaction) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: Transaction,
): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

async function handleSpecificRequest(
  this: TransactionAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
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
  this: TransactionAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: Transaction,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case accountSelectType: {
      // TODO: update types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ctx.update?.message as { text?: string };
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

export const TransactionAddWizardHandler = UnifiedWizardHandler<Transaction>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
