import { Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { handleButtonPress } from '../../../shared/helpers';
import { PartInService } from './part-in.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../user/user.service';
import {
  CtxWithUserId,
  SceneContextWithUserId,
} from '../../../bot/decorators/ctx-with-user-id.decorator';

@Scene(SCENES.PART_IN_LIST)
@SceneRoles('manager')
export class PartInListScene {
  constructor(
    @Inject(PartInService)
    readonly service: PartInService,

    @Inject(UserService)
    readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @CtxWithUserId() ctx: SceneContextWithUserId,
  ): Promise<void> {
    const userRole = await this.userService.getRoleByTelegramUserId(
      ctx.telegramUserId,
    );

    const partsInList = await this.service.getFormattedList(userRole);
    if (!partsInList) {
      await ctx.reply('Записей нет');
    } else {
      for (const partIn of partsInList) {
        await ctx.reply(partIn);
      }
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
