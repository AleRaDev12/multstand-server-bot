import { WizardStepType } from '../../helpers';
import { CustomWizardContext } from '../../shared/interfaces';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';
import { PartIn } from './part-in.entity';
import { Parts } from '../part-out/part-out.entity';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', field: 'part', type: 'union', union: Parts },
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

export const PartInWizardHandler = UnifiedWizardHandler<PartIn>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});
