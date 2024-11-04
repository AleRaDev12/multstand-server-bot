import { Account } from './account.entity';
import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/types';
import { AccountTransferWizard } from './account-transfer.wizard';
import { getMessageText } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage } from '../../../shared/sendMessages';

const stateEntityName = 'accountTransfer';
type TransferMoney = {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  date: Date;
  description: string;
  format: () => string;
};

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
  await sendMessage(
    ctx,
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
      const message = getMessageText(ctx);
      const selectedNumber = parseInt(message);

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
      return undefined;
  }
}

export const AccountTransferWizardHandler = wizardStepHandler<TransferMoney>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
