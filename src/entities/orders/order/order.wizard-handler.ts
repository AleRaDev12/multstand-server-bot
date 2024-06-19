import {
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { Order } from './order.entity';
import { OrderAddWizard } from './order-add.wizard';

const selectTypeName = 'clientSelect';

const steps: WizardStepType[] = [
  { message: 'Выберите клиента:', type: selectTypeName },
  { message: 'Дата договора:', field: 'contractDate', type: 'date' },
  {
    message: 'Количество дней на выполнение заказа:',
    field: 'daysToSend',
    type: 'number',
  },
  {
    message: 'Крайняя дата поставки:',
    field: 'deliveryDeadlineDate',
    type: 'date',
  },
  { message: 'Адрес доставки:', field: 'deliveryAddress', type: 'string' },
  { message: 'Трек-номер:', field: 'deliveryTrackNumber', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Order {
  return ctx.wizard.state.order;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.order = new Order();
}

function save(entity: Order) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Order): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

async function handleSpecificAnswer(
  this: OrderAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  if (stepAnswer.type !== selectTypeName) return true;

  // TODO: update types
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const message = ctx.update?.message as { text?: string };

  const selectedNumber = parseInt(message.text);

  const clients = await this.clientService.findAll();
  const client = clients[selectedNumber - 1];
  if (!client) {
    await replyWithCancelButton(ctx, 'Клиент не найден. Выберите из списка:');
    return false;
  }

  ctx.wizard.state.order.client = client;
  return true;
}

async function handleSpecificRequest(
  this: OrderAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  if (stepRequest.type !== selectTypeName) return true;

  const ordersList = await this.clientService.getList();
  await replyWithCancelButton(ctx, `${stepRequest.message}${ordersList}`);
  return true;
}

export const OrderWizardHandler = UnifiedWizardHandler<Order>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
