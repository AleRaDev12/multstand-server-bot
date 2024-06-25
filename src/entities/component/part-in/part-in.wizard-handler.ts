import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../../shared/interfaces';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { PartIn } from './part-in.entity';
import { PartInAddWizard } from './part-in-add.wizard';
import { Transaction } from '../../money/transaction/transaction.entity';

const componentTypeName: DbEntities = 'componentSelect';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', type: componentTypeName },
  { message: 'Дата заказа:', field: 'dateOrder', type: 'date' },
  { message: 'Дата получения:', field: 'dateArrival', type: 'date' },
  { message: 'Стоимость партии:', field: 'amount', type: 'number' },
  { message: 'Количество шт:', field: 'count', type: 'number' },
];

function getEntity(ctx: CustomWizardContext): PartIn {
  return ctx.wizard.state.partIn;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.partIn = new PartIn();
}

async function save(this: PartInAddWizard, entity: PartIn) {
  const partIn = await this.service.create(entity);

  const transaction = new Transaction();

  transaction.transactionDate = new Date();
  transaction.amount = entity.amount;
  transaction.description = `Покупка комплектующего: ${entity.component.name} в количестве ${entity.count} на сумму ${entity.amount}`;
  transaction.partIn = partIn;

  await this.moneyService.create(transaction);
  return partIn;
}

async function print(ctx: CustomWizardContext, entity: PartIn): Promise<void> {
  await ctx.reply(`Добавлено`);
}

async function handleSpecificAnswer(
  this: PartInAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  if (stepAnswer.type !== componentTypeName) return true;

  // TODO: update types
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const message = ctx.update?.message as { text?: string };

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

async function handleSpecificRequest(
  this: PartInAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  if (stepRequest.type !== componentTypeName) return true;

  const componentsList = await this.componentService.getList();
  await replyWithCancelButton(ctx, `${stepRequest.message}${componentsList}`);
  return true;
}

export const PartInWizardHandler = UnifiedWizardHandler<PartIn>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
