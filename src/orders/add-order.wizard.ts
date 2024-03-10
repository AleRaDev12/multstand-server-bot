import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { ADD_ORDER_WIZARD_ID } from '../shared/constants';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../shared/interfaces';

@Wizard(ADD_ORDER_WIZARD_ID)
export class AddOrderWizard {
  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @WizardStep(1)
  async onAmount(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.order = new Order();
    await ctx.wizard.next();
    return 'Выберите клиента из списка:';
  }

  @On('text')
  @WizardStep(2)
  async onClient(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    const users = await this.usersService.findAll();
    const user = users.find((u) => `${u.firstName} ${u.lastName}` === msg.text);
    if (!user) {
      return 'Клиент не найден. Выберите из списка:';
    }
    ctx.wizard.state.order.user = user;
    await ctx.wizard.next();
    return 'Введите дату договора (ГГГГ-ММ-ДД):';
  }

  @On('text')
  @WizardStep(3)
  async onContractDate(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.order.contractDate = new Date(msg.text);
    await ctx.wizard.next();
    return 'Введите количество дней на выполнение заказа:';
  }

  @On('text')
  @WizardStep(4)
  async onDaysToComplete(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.order.daysToComplete = parseInt(msg.text, 10);
    const order = await this.ordersService.create(ctx.wizard.state.order);
    await ctx.scene.leave();
    return `Заказ №${order.id} для клиента ${order.user.firstName} ${order.user.lastName} добавлен.`;
  }
}
