import { PartIn } from './part-in.entity';
import { PartInAddWizard } from './part-in-add.wizard';
import { Transaction } from '../../money/transaction/transaction.entity';
import { formatWithListIndexes, getMessageText } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { sendMessage } from '../../../shared/sendMessages';
import {
  setFieldValue,
  WizardStepCustomHandlerType,
  wizardStepHandler,
} from '../../../bot/wizard-step-handler-new';
import { Component } from '../component/component.entity';
import { Account } from '../../money/account/account.entity';
import {
  StepWizardContext,
  WizardData,
} from '../../../bot/wizard-step-handler-new/wizard-context-types';
import { WizardStep } from '../../../bot/wizard-step-handler-new/types';

type PartInData = {
  partIn: {
    component: Component;
    dateOrder: Date;
    dateArrival: Date;
    amount: number;
    count: number;
    description: string;
  };
  transactionDate: Date;
  account: Account;
};

const steps: WizardStep<PartInData, PartInAddWizard>[] = [
  { message: 'Комплектующее:', handler: componentHandler },
  { message: 'Дата заказа:', field: 'partIn.dateOrder', type: 'date' },
  {
    message: 'Дата оплаты:',
    field: 'transactionDate',
    type: 'date',
  },
  { message: 'Дата получения:', field: 'partIn.dateArrival', type: 'date' },
  { message: 'Стоимость партии:', field: 'partIn.amount', type: 'number' },
  { message: 'Количество шт:', field: 'partIn.count', type: 'number' },
  { message: 'Списано со счёта:', handler: accountHandler },
  { message: 'Описание:', field: 'partIn.description', type: 'string' },
];

async function componentHandler(
  wizard: PartInAddWizard,
  ctx: StepWizardContext<PartInData, PartInAddWizard>,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const componentsList = await wizard.componentService.getList();
    const listWithIndexes = formatWithListIndexes(componentsList);

    await replyWithCancelButton(ctx, listWithIndexes.join('\n'));
    return true;
  }

  const message = getMessageText(ctx);

  const selectedNumber = parseInt(message);
  const components = await wizard.componentService.findAll();
  const component = components[selectedNumber - 1];
  if (!component) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }

  setFieldValue(ctx, 'partIn.component', component);
  return true;
}

async function accountHandler(
  wizard: PartInAddWizard,
  ctx: StepWizardContext<PartInData, PartInAddWizard>,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const accountsList = await wizard.accountService.findAll();
    const formattedList = await wizard.accountService.formatList(accountsList);
    const formattedListWithIndexes = formatWithListIndexes(formattedList);

    await replyWithCancelButton(ctx, formattedListWithIndexes.join());
    return true;
  }

  const message = getMessageText(ctx);
  const selectedNumber = parseInt(message);
  const accounts = await wizard.accountService.findAll();
  const account = accounts[selectedNumber - 1];
  if (!account) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }

  setFieldValue(ctx, 'account', account);
  return true;
}

function createPartInEntity(
  data: WizardData<PartInData, PartInAddWizard>['values']['partIn'],
): PartIn {
  const partInEntity = new PartIn();
  Object.assign(partInEntity, data);
  return partInEntity;
}

// Helper function to create Transaction entity
function createTransactionEntity(
  partIn: PartIn,
  account: any,
  transactionDate: Date,
): Transaction {
  const transactionEntity = new Transaction();
  transactionEntity.amount = -partIn.amount;
  transactionEntity.partIn = partIn;
  transactionEntity.transactionDate = transactionDate;
  transactionEntity.account = account;
  transactionEntity.description = formatTransactionDescription(partIn);
  return transactionEntity;
}

function formatTransactionDescription(partIn: PartIn): string {
  return `Покупка комплектующего: ${partIn.component.name} в количестве ${partIn.count} на сумму ${partIn.amount}`;
}

export const PartInAddWizardHandler = wizardStepHandler<
  PartInData,
  PartInAddWizard
>({
  initialSteps: steps,
  afterLastStep: async function (
    wizard: PartInAddWizard,
    ctx: StepWizardContext<PartInData, PartInAddWizard>,
  ) {
    const values = ctx.wizard.state.data.values;

    const partInEntity = createPartInEntity(values.partIn);
    const savedPartIn = await wizard.service.create(partInEntity);

    const transactionEntity = createTransactionEntity(
      savedPartIn,
      values.account,
      values.transactionDate,
    );
    await wizard.transactionService.create(transactionEntity);

    await sendMessage(ctx, `Добавлено`);
  },
});
