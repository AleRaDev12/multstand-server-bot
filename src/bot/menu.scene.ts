import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';
import { SceneRoles } from './decorators/scene-roles.decorator';

@Scene(SCENES.MENU)
@SceneRoles('manager', 'master', 'unregistered')
export class MenuScene {
  constructor(
    @Inject(UserService)
    readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const telegramUserId = ctx.from.id;
    const user = await this.userService.findByTelegramId(telegramUserId);
    const role = user.role;

    if (role === 'unregistered') {
      await ctx.reply('Ваша регистрация ещё не подтверждена');
      return;
    }

    if (['manager', 'master'].includes(role)) {
      await ctx.reply(`Добро пожаловать, ${user.name} (роль: ${user.role}).`);
      await ctx.reply('Меню:', MENU[role]);
    }
  }

  @Action('client')
  async onClient(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.CLIENT));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('order')
  async onOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_stand')
  async onAddStandProd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_STAND_PROD));
  }

  @Action('add_partsIn')
  async onAddPartIn(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_IN));
  }

  @Action('add_partsOut')
  async onAddPartOut(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_OUT));
  }

  @Action('add_work')
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_WORK));
  }

  @Action('add_task')
  async onAddTask(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_TASK));
  }

  @Action('parts')
  async parts(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }

  @Action('money')
  async onAddMoney(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.MONEY));
  }

  @Action('stand_orders_active_list')
  async standOrdersActiveList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.STAND_ORDER_ACTIVE_LIST),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('user_registration')
  async onUserRegistration(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.REGISTER));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
}

const MENU = {
  manager: Markup.inlineKeyboard([
    [Markup.button.callback('Клиенты', 'client')],
    [Markup.button.callback('Заказы', 'order')],

    [Markup.button.callback('Компоненты', 'parts')],
    [
      Markup.button.callback('Работа', 'add_work'),
      Markup.button.callback('Задача', 'add_task'),
    ],
    [Markup.button.callback('Деньги', 'money')],
    [Markup.button.callback('Регистрации', 'user_registration')],
  ]),
  master: Markup.inlineKeyboard([
    [Markup.button.callback('➕ Работа', 'add_work')],
    [Markup.button.callback('📑 Станки-заказы', 'stand_orders_active_list')],
  ]),
};
