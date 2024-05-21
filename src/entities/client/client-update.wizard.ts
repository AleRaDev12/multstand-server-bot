import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { CustomWizardContext, WizardStepTypeN } from '../../shared/interfaces';
import { Client } from './client.entity';
import { ClientService } from './client.service';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../UnifiedWizardHandler';
import { ScenesWizards } from '../../shared/scenes-wizards';

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

async function save(this: ClientUpdateWizard, entity: Client) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: Client): Promise<void> {
  await ctx.reply(
    `Клиент ${entity.firstName} ${entity.lastName} с номером ${entity.phoneNumber} из города ${entity.city} обновлен.`,
  );
}

export const ClientUpdateWizardHandler = UnifiedWizardHandler<Client>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
});

@Wizard(ScenesWizards.CLIENT_UPDATE)
export class ClientUpdateWizard {
  constructor(
    @Inject(ClientService)
    readonly service: ClientService,
  ) {}

  @WizardStep(1)
  async onClientId(@Ctx() ctx: CustomWizardContext): Promise<void> {
    const clientsList = await this.service.getList();

    await replyWithCancelButton(
      ctx,
      `Введите ID клиента для изменения:\n${clientsList}`,
    );
    ctx.wizard.next();
  }

  @On('text')
  @WizardStep(2)
  async onSelectClient(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<void> {
    const clientId = parseInt(msg.text);
    if (isNaN(clientId)) {
      await replyWithCancelButton(
        ctx,
        'Некорректный ID. Пожалуйста, введите числовое значение.',
      );
      return;
    }

    const client = await this.service.findOne(clientId);
    if (!client) {
      await replyWithCancelButton(
        ctx,
        'Клиент не найден. Пожалуйста, введите корректный ID.',
      );
      return;
    }

    ctx.wizard.state[entityName] = client;
    ctx.wizard.next();
  }

  @On('text')
  @WizardStep(3)
  @ClientUpdateWizardHandler(1)
  async onFirstName1() {}

  @On('text')
  @WizardStep(4)
  @ClientUpdateWizardHandler(2)
  async onFirstName() {}

  @On('text')
  @WizardStep(5)
  @ClientUpdateWizardHandler(3)
  async onLastName() {}

  @On('text')
  @WizardStep(6)
  @ClientUpdateWizardHandler(4)
  async onPhoneNumber() {}

  @On('text')
  @WizardStep(7)
  @ClientUpdateWizardHandler(5)
  async onCity() {}

  @On('text')
  @WizardStep(8)
  @ClientUpdateWizardHandler(6)
  async onEmail() {}

  @On('text')
  @WizardStep(9)
  @ClientUpdateWizardHandler(7)
  async onOrganization() {}

  @On('text')
  @WizardStep(10)
  @ClientUpdateWizardHandler(8)
  async onDescription() {}

  @On('text')
  @WizardStep(11)
  @ClientUpdateWizardHandler(8)
  async onDescription1() {}
}
