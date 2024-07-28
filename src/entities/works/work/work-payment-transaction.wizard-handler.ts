import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { WorkPaymentTransactionWizard } from './work-payment-transaction.wizard';
import { Transaction } from '../../money/transaction/transaction.entity';
import { sendMessage } from '../../../shared/senMessages';

const masterSelect: AdditionalWizardSelections = 'masterSelect';
const accountSelect: AdditionalWizardSelections = 'accountSelect';
const entityName = 'transaction';

const commonSteps: WizardStepType[] = [
  { message: 'Мастер:', type: masterSelect },
  {
    message: 'Сумма выплаты:',
    field: 'amount',
    type: 'number',
  },
  { message: 'Счёт:', type: accountSelect },
  { message: 'Дата выплаты:', field: 'transactionDate', type: 'date' },
];

const initialSteps: WizardStepType[] = [...commonSteps];

function getEntity(ctx: CustomWizardContext): Transaction {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Transaction();
}

function save(this: WorkPaymentTransactionWizard, entity: Transaction) {
  entity.amount = -entity.amount;
  entity.description = `Выплата ${entity.master.user.name}`;
  return this.transactionService.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: Transaction,
): Promise<void> {
  await sendMessage(ctx, `Добавлено`);
}

async function handleSpecificRequest(
  this: WorkPaymentTransactionWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case masterSelect: {
      const masterList = await this.masterService.getList();
      await replyWithCancelButton(ctx, `${stepRequest.message}${masterList}`);
      return true;
    }

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
      return true;
  }
}

async function handleSpecificAnswer(
  this: WorkPaymentTransactionWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: Transaction,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case masterSelect: {
      const message = getMessage(ctx);

      const selectedNumber = parseInt(message.text);

      const masters = await this.masterService.findAll();
      const master = masters[selectedNumber - 1];
      if (!master) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      entity.master = master;
      return true;
    }

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

export const WorkPaymentTransactionWizardHandler =
  wizardStepHandler<Transaction>({
    getEntity,
    setEntity,
    save,
    print,
    initialSteps: initialSteps,
    handleSpecificAnswer,
    handleSpecificRequest,
  });
