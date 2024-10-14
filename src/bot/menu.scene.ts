import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';
import { SceneRoles } from './decorators/scene-roles.decorator';
import { CtxAuth } from './decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../shared/interfaces';
import { sendMessage, sendMessages } from '../shared/senMessages';
import { WorkService } from '../entities/works/work/work.service';
import { StandProdService } from '../entities/parts/stand-prod/stand-prod.service';

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
  WORK_BALANCE = 'work_balance',
  WORK_LIST_BY_DATE = 'work_list_by_date',
  WORK_LIST_BY_STANDS = 'work_list_by_stands',
}

@Scene(SCENES.MENU)
@SceneRoles('manager', 'master', 'unregistered')
export class MenuScene {
  constructor(
    @Inject(UserService)
    readonly userService: UserService,
    @Inject(WorkService)
    private readonly workService: WorkService,
    @Inject(StandProdService)
    private readonly standProdService: StandProdService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const role = ctx.userRole;

    if (['manager', 'master'].includes(role)) {
      await sendMessage(ctx, 'Меню:', MENU[role]);
      return;
    }
    await sendMessage(ctx, `Меню недоступно для вашей роли: ${role}`);
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
    await this.enterScene(ctx, SCENES.REGISTRATION_USER);
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

  @Action(Actions.WORK_BALANCE)
  async onWorkBalance(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const user = await this.userService.findByTelegramId(ctx.from.id);
    const userId = user.id;
    const earnings = await this.workService.calculateEarnings(userId);

    await sendMessage(
      ctx,
      `Баланс:\nНачислено: ${earnings.totalEarned}\nВыплачено: ${earnings.alreadyPaid}\nОсталось выплатить: ${earnings.toPay}`,
    );
    await this.enterScene(ctx, SCENES.MENU);
  }

  @Action(Actions.WORK_LIST_BY_STANDS)
  async onWorkListByStands(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const user = await this.userService.findByTelegramId(ctx.from.id);
    const standsProdStat =
      await this.standProdService.getStandProdsWithWorksByMaster(
        user.id,
        ctx.userRole,
      );

    await sendMessages(ctx, standsProdStat);
    await this.enterScene(ctx, SCENES.MENU);
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
      Markup.button.callback(
        '📑 Станки-заказы',
        Actions.STAND_ORDERS_ACTIVE_LIST,
      ),
    ],
    [Markup.button.callback('🔧️ Добавить отчёт', Actions.WORK_ADD)],
    [
      Markup.button.callback('🔧️ Мои отчёты: по дате', Actions.WORK_LIST),
      Markup.button.callback(
        '🔧 Мои отчёты: по станкам',
        Actions.WORK_LIST_BY_STANDS,
      ),
    ],
    [Markup.button.callback('💰 Баланс', Actions.WORK_BALANCE)],
  ]),
};
