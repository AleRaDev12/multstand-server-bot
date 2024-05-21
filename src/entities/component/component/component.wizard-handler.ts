import {
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { UnifiedWizardHandler } from '../../../UnifiedWizardHandler';
import { Component } from './component.entity';

const steps: WizardStepType[] = [
  { message: 'Название комплектующего:', field: 'name', type: 'string' },
  { message: 'Тип комплектующего:', field: 'type', type: 'string' },
  { message: 'Описание:', field: 'description', type: 'string' },
  { message: 'Ссылка:', field: 'link', type: 'string' },
  { message: 'Комментарий:', field: 'comment', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Component {
  return ctx.wizard.state.component;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.component = new Component();
}

function save(entity: Component) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: Component,
): Promise<void> {
  await ctx.reply(`${JSON.stringify(entity, null, 2)} добавлен`);
}

export const ComponentWizardHandler = UnifiedWizardHandler<Component>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});
