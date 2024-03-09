import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { ADD_USER_WIZARD_ID } from '../constants';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../interfaces'; // Новый импорт

@Wizard(ADD_USER_WIZARD_ID)
export class AddUserWizard {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @WizardStep(1)
  async onPhoneNumber(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.user = new User();
    await ctx.wizard.next();
    return 'Введите имя:';
  }

  @On('text')
  @WizardStep(2)
  async onFirstName(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.phoneNumber = msg.text;
    await ctx.wizard.next();
    return 'Введите фамилию:';
  }

  @On('text')
  @WizardStep(3)
  async onLastName(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.firstName = msg.text;
    await ctx.wizard.next();
    return 'Введите город:';
  }

  @On('text')
  @WizardStep(4)
  async onCity(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.user.lastName = msg.text;
    ctx.wizard.state.user.city = msg.text;
    const user = await this.usersService.create(ctx.wizard.state.user);
    await ctx.scene.leave();
    return `Пользователь ${user.firstName} ${user.lastName} добавлен.`;
  }
}
