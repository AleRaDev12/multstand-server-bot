import { PartOut, Parts } from './part-out.entity';
import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', field: 'part', type: 'union', union: Parts },
  { message: 'Дата заказа:', field: 'dateOrder', type: 'date' },
  { message: 'Дата получения:', field: 'dateArrival', type: 'date' },
  { message: 'Стоимость партии:', field: 'amount', type: 'number' },
  { message: 'Количество шт:', field: 'count', type: 'number' },
];

function getEntity(ctx: CustomWizardContext): PartOut {
  return ctx.wizard.state.partOut;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.partOut = new PartOut();
}

function save(entity: PartOut) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: PartOut): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

export const PartOutWizardHandler = UnifiedWizardHandler<PartOut>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});
