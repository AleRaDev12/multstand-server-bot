import { Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { handleButtonPress } from '../../../shared/helpers';
import { PartOutService } from './part-out.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../user/user.service';
import { CtxAuth } from '../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../shared/interfaces';

@Scene(SCENES.PART_OUT_LIST)
@SceneRoles('manager')
export class PartOutListScene {
  constructor(
    @Inject(PartOutService)
    readonly service: PartOutService,
    @Inject(UserService)
    readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const userRole = ctx.userRole;
    const list = await this.service.getList(userRole);
    await ctx.reply(list ?? 'Записей нет');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
