import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { Account } from './account.entity';
import {
  CustomWizardContext,
  AdditionalWizardSelections,
  WizardStepType,
} from '../../../shared/interfaces';
import { AccountTransferWizard } from './account-transfer.wizard';
import { getMessage } from '../../../shared/helpers';

const stateEntityName = 'accountTransfer';
type TransferMoney = {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  date: Date;
  description: string;
};

// Define entity type for account selection
const accountSelectType: AdditionalWizardSelections = 'accountSelect';

const steps: WizardStepType[] = [
  {
    message: 'Счёт-источник:',
    type: accountSelectType,
  },
  {
    message: 'Счёт-назначение:',
    type: accountSelectType,
  },
  { message: 'Сумма:', field: 'amount', type: 'number' },
  { message: 'Дата:', field: 'date', type: 'date' },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): TransferMoney {
  return ctx.wizard.state[stateEntityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[stateEntityName] = {} as TransferMoney;
}

async function save(this: AccountTransferWizard, entity: TransferMoney) {
  await this.service.transferMoney({
    fromAccountId: entity.fromAccount.id,
    toAccountId: entity.toAccount.id,
    amount: entity.amount,
    date: entity.date,
    description: entity.description,
  });

  return entity;
}

async function print(
  ctx: CustomWizardContext,
  entity: TransferMoney,
): Promise<void> {
  await ctx.reply(
    `Перевод ${entity.amount} со счёта ${entity.fromAccount.name} на счёт ${entity.toAccount.name} выполнен.`,
  );
}

async function handleSpecificAnswer(
  this: AccountTransferWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: TransferMoney,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case accountSelectType: {
      const message = getMessage(ctx);
      const selectedNumber = parseInt(message.text);

      const accounts = await this.service.findAll();
      const account = accounts[selectedNumber - 1];
      if (!account) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      if (!entity.fromAccount) {
        entity.fromAccount = account;
      } else {
        entity.toAccount = account;
      }

      return true;
    }
    default:
      return true;
  }
}

async function handleSpecificRequest(
  this: AccountTransferWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case accountSelectType: {
      const accountsList = (await this.service.findAll())
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

export const AccountTransferWizardHandler = UnifiedWizardHandler<TransferMoney>(
  {
    getEntity,
    setEntity,
    save,
    print,
    initialSteps: steps,
    handleSpecificAnswer,
    handleSpecificRequest,
  },
);
