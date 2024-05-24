import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';

@Scene(SCENES.UNREGISTERED)
export class UnregisteredScene {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    const userId = ctx.from.id;
    await ctx.reply('Вы не зарегистрированы. Отправьте заявку на регистрацию.');
    await this.userService.createRequest(userId, ctx.from.username);
    await ctx.reply('Заявка отправлена. Ожидайте подтверждения.');
    await ctx.scene.leave(); // Оставляем сцену после отправки заявки
  }
}
