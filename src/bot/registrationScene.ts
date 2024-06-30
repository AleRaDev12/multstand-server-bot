import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';
import { SceneRoles } from './decorators/scene-roles.decorator';

@Scene(SCENES.REGISTRATION)
@SceneRoles('unknown')
export class RegistrationScene {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    const userId = ctx.from.id;
    await ctx.reply('Отправляется заявка на регистрацию.');
    await this.userService.createRequest(userId);
    await ctx.reply('Отправлена. Ожидайте подтверждения.');
    await ctx.scene.leave();
  }
}
