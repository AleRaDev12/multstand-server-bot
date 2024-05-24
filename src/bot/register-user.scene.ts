import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';

@Scene(SCENES.REGISTER)
export class RegisterUserScene {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    const userId = ctx.from.id;
    const username = ctx.from.username;
    await this.userService.createRequest(userId, username);
    await ctx.reply(
      'Заявка на регистрацию отправлена. Ожидайте подтверждения.',
    );
  }

  @Action(/register_(.+)/)
  async onRegister(@Ctx() ctx: Scenes.SceneContext) {
    const userId = 1; // Number(ctx.match[1]);
    await this.userService.approveRequest(userId);
    await ctx.reply('Пользователь зарегистрирован.');
    await ctx.scene.leave();
  }
}
