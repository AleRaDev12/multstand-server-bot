import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';
import { SceneRoles } from './decorators/scene-roles.decorator';
import { CtxAuth } from './decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../shared/interfaces';
import { sendMessage } from '../shared/senMessages';

enum Actions {
  CLIENT = 'client',
  ORDER = 'order',
  ADD_STAND = 'add_stand',
  ADD_PARTS_IN = 'add_partsIn',
  ADD_PARTS_OUT = 'add_partsOut',
  PARTS = 'parts',
  MONEY = 'money',
  STAND_ORDERS_ACTIVE_LIST = 'stand_orders_active_list',
  USER_REGISTRATION = 'user_registration',
  WORKS = 'works',
  WORK_ADD = 'work_add',
  WORK_LIST = 'work_list',
}

@Scene(SCENES.MENU)
@SceneRoles('manager', 'master', 'unregistered')
export class MenuScene {
  constructor(
    @Inject(UserService)
    readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const user = await this.userService.findByTelegramId(ctx.from.id);
    const role = ctx.userRole;

    if (role === 'unregistered') {
      await sendMessage(ctx, 'Ваша регистрация ещё не подтверждена');
      return;
    }

    if (['manager', 'master'].includes(role)) {
      await sendMessage(
        ctx,
        `Добро пожаловать, ${user.name} (роль: ${user.role}).`,
      );
      await sendMessage(ctx, 'Меню:', MENU[role]);
      return;
    }

    await sendMessage(ctx, 'Неизвестная ошибка');
  }

  @Action(Actions.CLIENT)
  async onClient(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.CLIENT);
  }

  @Action(Actions.ORDER)
  async onOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.ORDERS);
  }

  @Action(Actions.ADD_STAND)
  async onAddStandProd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, WIZARDS.ADD_STAND_PROD);
  }

  @Action(Actions.ADD_PARTS_IN)
  async onAddPartIn(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, WIZARDS.ADD_PART_IN);
  }

  @Action(Actions.ADD_PARTS_OUT)
  async onAddPartOut(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, WIZARDS.ADD_PART_OUT);
  }

  @Action(Actions.PARTS)
  async parts(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.PARTS);
  }

  @Action(Actions.MONEY)
  async onAddMoney(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.MONEY);
  }

  @Action(Actions.STAND_ORDERS_ACTIVE_LIST)
  async standOrdersActiveList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.STAND_ORDER_ACTIVE_LIST);
  }

  @Action(Actions.USER_REGISTRATION)
  async onUserRegistration(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.REGISTER);
  }

  @Action(Actions.WORKS)
  async onWorks(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.WORKS);
  }

  @Action(Actions.WORK_ADD)
  async onWorkAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, WIZARDS.WORK_ADD);
  }

  @Action(Actions.WORK_LIST)
  async onWorkList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await this.enterScene(ctx, SCENES.WORK_LIST);
  }

  private async enterScene(
    ctx: Scenes.SceneContext,
    scene: string,
  ): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(scene));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }
}

const MENU = {
  manager: Markup.inlineKeyboard([
    [Markup.button.callback('Клиенты', Actions.CLIENT)],
    [Markup.button.callback('Заказы', Actions.ORDER)],
    [Markup.button.callback('Компоненты', Actions.PARTS)],
    [Markup.button.callback('Работа', Actions.WORKS)],
    [Markup.button.callback('Деньги', Actions.MONEY)],
    [Markup.button.callback('Регистрации', Actions.USER_REGISTRATION)],
  ]),
  master: Markup.inlineKeyboard([
    [
      Markup.button.callback('➕ Работа', Actions.WORK_ADD),
      Markup.button.callback('📊 Список, сумма', Actions.WORK_LIST),
    ],
    [
      Markup.button.callback(
        '📑 Станки-заказы',
        Actions.STAND_ORDERS_ACTIVE_LIST,
      ),
    ],
  ]),
};
