import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../shared/senMessages';
import { CtxAuth } from '../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../shared/interfaces';

@Scene(SCENES.CLIENT)
@SceneRoles('manager')
export class ClientScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    console.log('*-* CLIENT ctx.userRole', ctx.userRole);

    await sendMessage(
      ctx,
      'Клиенты:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Список', 'list')],
        [Markup.button.callback('Добавить', 'add')],
        [Markup.button.callback('Изменить (не работает)', 'update')],
        [this.menuButton],
      ]),
    );
  }

  @Action('list')
  async onList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.CLIENT_LIST));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action('add')
  async onAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.CLIENT_ADD));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action('update')
  async onUpdate(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.CLIENT_UPDATE),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }
}
