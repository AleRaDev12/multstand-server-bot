import {
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { Order } from './order.entity';
import { OrderAddWizard } from './order-add.wizard';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage } from '../../../shared/senMessages';

const selectTypeName = 'clientSelect';

const steps: WizardStepType[] = [
  { message: 'Выберите клиента:', type: selectTypeName },
  { message: 'Дата договора:', field: 'contractDate', type: 'date' },
  {
    message: 'Количество дней до отправки:',
    field: 'daysToSend',
    type: 'number',
  },
  {
    message: 'Крайняя дата поставки. "-" чтобы пропустить.:',
    field: 'deliveryDeadlineDate',
    type: 'date',
  },
  {
    message: 'Доставка: кто платит / до двери / до пункта выдачи / не СДЭК:',
    field: 'deliveryType',
    type: 'string',
  },
  { message: 'Адрес доставки:', field: 'deliveryAddress', type: 'string' },
  { message: 'Трек-номер:', field: 'deliveryTrackNumber', type: 'string' },
  {
    message:
      'Доплата за доставку за заказ в целом (есть ещё доплата каждого станка-заказа отдельно):',
    field: 'deliveryCost',
    type: 'number',
  },
  {
    message: 'Описание:',
    field: 'description',
    type: 'string',
  },
];

function getEntity(ctx: CustomWizardContext): Order {
  return ctx.wizard.state.order;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.order = new Order();
}

function save(this: OrderAddWizard, entity: Order) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Order): Promise<void> {
  await sendMessage(ctx, `Добавлено`);
}

async function handleSpecificAnswer(
  this: OrderAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  if (stepAnswer.type !== selectTypeName) return true;
  const message = getMessage(ctx);

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
  await replyWithCancelButton(ctx, `${stepRequest.message}\n${ordersList}`);
  return true;
}

export const OrderAddWizardHandler = wizardStepHandler<Order>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
