import { CustomWizardContext, WizardStepTypeN } from '../../shared/interfaces';
import { Client } from './client.entity';
import { ClientAddWizard } from './client-add.wizard';
import { wizardStepHandler } from '../../bot/wizard-step-handler/wizardStepHandler';

const entityName = 'client';

const steps: WizardStepTypeN<Client>[] = [
  { message: 'Имя:', field: 'firstName', type: 'string' },
  { message: 'Фамилия:', field: 'lastName', type: 'string' },
  { message: 'Номер телефона:', field: 'phoneNumber', type: 'string' },
  { message: 'Город:', field: 'city', type: 'string' },
  { message: 'Email:', field: 'email', type: 'string' },
  { message: 'Организация:', field: 'organization', type: 'string' },
  { message: 'Пометки:', field: 'description', type: 'string' },
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

export const ClientWizardHandler = wizardStepHandler<Client>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
});
