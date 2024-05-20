import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { Client } from './client.entity';
import { ClientAddWizard } from './clientAdd.wizard';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';

const entityName = 'client';

const steps: WizardStepType[] = [
  { message: 'Введите имя:', field: 'firstName', type: 'string' },
  { message: 'Введите фамилию:', field: 'lastName', type: 'string' },
  { message: 'Введите номер телефона:', field: 'phoneNumber', type: 'string' },
  { message: 'Введите город:', field: 'city', type: 'string' },
];

function getEntity(ctx: CustomWizardContext): Client {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new Client();
}

function save(this: ClientAddWizard, entity: Client) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Client): Promise<void> {
  await ctx.reply(
    `Клиент ${entity.firstName} ${entity.lastName} с номером ${entity.phoneNumber} из города ${entity.city} добавлен.`,
  );
}

export const ClientWizardHandler = UnifiedWizardHandler<Client>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});
