import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { PartIn } from './part-in.entity';
import { PartInAddWizard } from './part-in-add.wizard';
import { Transaction } from '../../money/transaction/transaction.entity';
import { formatWithListIndexes, getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';

const componentTypeName: AdditionalWizardSelections = 'componentSelect';
const accountSelect: AdditionalWizardSelections = 'accountSelect';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', type: componentTypeName },
  { message: 'Дата заказа:', field: 'dateOrder', type: 'date' },
  { message: 'Дата получения:', field: 'dateArrival', type: 'date' },
  {
    message: 'Дата оплаты:',
    field: 'transactionDate',
    linkedEntity: 'transaction',
    type: 'date',
  },
  { message: 'Стоимость партии:', field: 'amount', type: 'number' },
  { message: 'Количество шт:', field: 'count', type: 'number' },
  { message: 'Списано со счёта:', type: accountSelect },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): PartIn {
  return ctx.wizard.state.partIn;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.partIn = new PartIn();
  ctx.wizard.state.transaction = new Transaction();
}

async function save(
  this: PartInAddWizard,
  entity: PartIn,
  ctx?: CustomWizardContext,
) {
  const partIn = await this.service.create(entity);

  const transaction = ctx.wizard.state.transaction;

  transaction.amount = -entity.amount;
  transaction.partIn = partIn;
  transaction.account = ctx.wizard.state.account;
  transaction.description = `Покупка комплектующего: ${entity.component.name} в количестве ${entity.count} на сумму ${entity.amount}`;

  await this.transactionService.create(transaction);
  return partIn;
}

async function print(ctx: CustomWizardContext, entity: PartIn): Promise<void> {
  await ctx.reply(`Добавлено`);
}

async function handleSpecificRequest(
  this: PartInAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case componentTypeName: {
      const componentsList = await this.componentService.getList();
      const listWithIndexes = formatWithListIndexes(componentsList);

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${listWithIndexes.join('\n')}`,
      );
      return true;
    }
    case accountSelect: {
      const accountsList = await this.accountService.findAll();
      const formattedList = await this.accountService.formatList(accountsList);
      const formattedListWithIndexes = formatWithListIndexes(formattedList);

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${formattedListWithIndexes.join()}`,
      );
      return true;
    }
    default:
      return true;
  }
}

async function handleSpecificAnswer(
  this: PartInAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case componentTypeName: {
      const message = getMessage(ctx);

      const selectedNumber = parseInt(message.text);
      const components = await this.componentService.findAll();
      const component = components[selectedNumber - 1];
      if (!component) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state.partIn.component = component;
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
      ctx.wizard.state.account = account;
      return true;
    }
    default:
      return true;
  }
}

export const PartInAddWizardHandler = wizardStepHandler<PartIn>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
