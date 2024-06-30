import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { PartIn } from './part-in.entity';
import { PartInAddWizard } from './part-in-add.wizard';
import { Transaction } from '../../money/transaction/transaction.entity';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';

const componentTypeName: AdditionalWizardSelections = 'componentSelect';
const accountSelect: AdditionalWizardSelections = 'accountSelect';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', type: componentTypeName },
  { message: 'Дата заказа:', field: 'dateOrder', type: 'date' },
  { message: 'Дата получения:', field: 'dateArrival', type: 'date' },
  { message: 'Стоимость партии:', field: 'amount', type: 'number' },
  { message: 'Количество шт:', field: 'count', type: 'number' },
  { message: 'Списано со счёта:', type: accountSelect },
];

function getEntity(ctx: CustomWizardContext): PartIn {
  return ctx.wizard.state.partIn;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.partIn = new PartIn();
}

async function save(
  this: PartInAddWizard,
  entity: PartIn,
  ctx?: CustomWizardContext,
) {
  const partIn = await this.service.create(entity);

  const transaction = new Transaction();

  transaction.transactionDate = new Date();
  transaction.amount = entity.amount;
  transaction.description = `Покупка комплектующего: ${entity.component.name} в количестве ${entity.count} на сумму ${entity.amount}`;
  transaction.partIn = partIn;
  transaction.account = ctx.wizard.state.account;

  console.log('*-* transaction', transaction);

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
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${componentsList}`,
      );
      return true;
    }
    case accountSelect: {
      const accountsList = await this.accountService.findAll();
      const formattedList = await this.accountService.formatList(accountsList);

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${formattedList.join('\n')}`,
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
      console.log('*-* selectedNumber', selectedNumber);

      const components = await this.componentService.findAll();
      console.log('*-* components', components);
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
      console.log('*-* ctx.wizard.state.account', ctx.wizard.state.account);
      return true;
    }
    default:
      return true;
  }
}

export const PartInWizardHandler = wizardStepHandler<PartIn>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
