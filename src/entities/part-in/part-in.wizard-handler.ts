import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';
import { PartIn } from './part-in.entity';
import { PartInAddWizard } from './part-in-add.wizard';

const selectTypeName = 'componentSelect';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', field: 'part', type: selectTypeName },
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

function save(entity: PartIn) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: PartIn): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

async function handleSpecificAnswer(
  this: PartInAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  if (stepAnswer.type !== selectTypeName) return true;

  // TODO: update types
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const message = ctx.update?.message as { text?: string };

  const selectedNumber = parseInt(message.text);

  const components = await this.componentService.findAll();
  const component = components[selectedNumber - 1];
  if (!component) {
    await ctx.reply('Не найдено. Выберите из списка.');
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
  if (stepRequest.type !== selectTypeName) return true;

  const componentsList = await this.componentService.getList();
  await ctx.reply(`${stepRequest.message}${componentsList}`);
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
