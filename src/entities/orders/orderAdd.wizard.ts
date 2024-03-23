import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { ClientsService } from '../clients/clients.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext, MessageType } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';

@Wizard(WIZARDS.ADD_ORDER_WIZARD_ID)
export class OrderAddWizard {
  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
    @Inject(ClientsService)
    private readonly usersService: ClientsService,
  ) {}

  @WizardStep(1)
  async onStart(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.order = new Order();
    ctx.wizard.next();
    const clients = await this.usersService.findAll();

    return `Выберите клиента из списка: ${clients.map((client, i) => `\n${i + 1}. ${client.firstName} ${client.lastName} ${client.city}`)}`;
  }

  @On('text')
  @WizardStep(2)
  async onClient(
    @Ctx() ctx: CustomWizardContext,
    @Message() message: MessageType,
  ): Promise<string> {
    const selectedNumber = parseInt(message.text);
    const clients = await this.usersService.findAll();
    const client = clients[selectedNumber - 1];
    if (!client) {
      return 'Клиент не найден. Выберите из списка:';
    }
    ctx.wizard.state.order.client = client;
    ctx.wizard.next();
    return 'Введите дату договора (ГГГГ-ММ-ДД):';
  }

  @On('text')
  @WizardStep(3)
  async onContractDate(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.order.contractDate = new Date(msg.text);
    ctx.wizard.next();

    ctx.update.update_id;

    return 'Введите количество дней на выполнение заказа:';
  }

  @On('text')
  @WizardStep(4)
  async onDaysToComplete(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.order.daysToComplete = parseInt(msg.text);
    ctx.wizard.next();
    return 'Введите стоимость заказа:';
  }

  @On('text')
  @WizardStep(5)
  async onAmount(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.order.amount = parseInt(msg.text);
    const order = await this.ordersService.create(ctx.wizard.state.order);
    await ctx.scene.leave();
    return `Заказ №${order.id} для клиента ${order.client.firstName} ${order.client.lastName} добавлен.`;
  }
}
