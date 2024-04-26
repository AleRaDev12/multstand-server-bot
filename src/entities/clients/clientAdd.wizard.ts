import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Client } from './client.entity';
import { ClientsService } from './clients.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards'; // Новый импорт

@Wizard(WIZARDS.ADD_USER_WIZARD_ID)
export class ClientAddWizard {
  constructor(
    @Inject(ClientsService)
    private readonly usersService: ClientsService,
  ) {}

  @WizardStep(1)
  async onPhoneNumber(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.user = new Client();
    await ctx.wizard.next();
    return 'Введите имя:';
  }

  @On('text')
  @WizardStep(2)
  async onFirstName(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.firstName = msg.text;
    await ctx.wizard.next();
    return 'Введите фамилию:';
  }

  @On('text')
  @WizardStep(3)
  async onLastName(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.lastName = msg.text;
    await ctx.wizard.next();
    return 'Введите номер телефона:';
  }

  @On('text')
  @WizardStep(4)
  async onPhone(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.phoneNumber = msg.text;
    await ctx.wizard.next();
    return 'Введите город:';
  }

  @On('text')
  @WizardStep(5)
  async onCity(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.city = msg.text;
    const user = await this.usersService.create(ctx.wizard.state.user);
    await ctx.scene.leave();
    return `Клиент ${user.firstName} ${user.lastName} ${user.phoneNumber} ${user.city} добавлен.`;
  }
}
