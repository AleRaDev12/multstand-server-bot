import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { handleButtonPress } from '../../../shared/helpers';
import { PartInService } from './part-in.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../user/user.service';
import { CustomSceneContext } from '../../../shared/types';
import { sendMessage } from '../../../shared/sendMessages';

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
  async onSceneEnter(@Ctx() ctx: CustomSceneContext): Promise<void> {
    const userRole = ctx.session.userRole;

    const partsInList = await this.service.getFormattedList(userRole);
    if (!partsInList) {
      await sendMessage(ctx, 'Записей нет');
    } else {
      for (const partIn of partsInList) {
        await sendMessage(ctx, partIn);
      }
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
