import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../shared/interfaces';
import { Money } from './money.entity';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../UnifiedWizardHandler';
import { MoneyOrderAddWizard } from './add-money-order.wizard';

const orderSelectType: DbEntities = 'orderSelect';
const entityName = 'moneyOrder';

const steps: WizardStepType[] = [
  { message: 'Выберите заказ:', type: orderSelectType },
  {
    message: 'Введите сумму транзакции:',
    field: 'amount',
    type: 'number',
  },
  {
    message: 'Введите дату транзакции (в формате ГГГГ-ММ-ДД):',
    field: 'transactionDate',
    type: 'date',
  },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Money {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Money();
}

async function save(this: MoneyOrderAddWizard, entity: Money) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Money): Promise<void> {
  await ctx.reply(`Транзакция ${JSON.stringify(entity, null, 2)} добавлена`);
}

async function handleSpecificAnswer(
  this: MoneyOrderAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: Money,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case orderSelectType: {
      // TODO: update types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ctx.update?.message as { text?: string };
      const selectedNumber = parseInt(message.text);

      const orders = await this.orderService.findAll();
      const order = orders[selectedNumber - 1];
      if (!order) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      entity.order = order;
      return true;
    }
    default:
      return true;
  }
}

async function handleSpecificRequest(
  this: MoneyOrderAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case orderSelectType: {
      const ordersList = await this.orderService.getList();
      await replyWithCancelButton(ctx, `${stepRequest.message}\n${ordersList}`);
      return true;
    }
    default:
      return false;
  }
}

export const MoneyOrderWizardHandler = UnifiedWizardHandler<Money>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
