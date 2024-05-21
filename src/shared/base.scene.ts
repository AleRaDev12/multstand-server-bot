import { Action, Ctx } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES } from './scenes-wizards';
import { handleButtonPress } from './helpers';

export class BaseScene {
  protected menuButton = Markup.button.callback('Меню', 'menu');

  @Action('menu')
  async onMenu(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.MENU));
  }
}
