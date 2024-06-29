import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../entities/user/user.service';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { UserRole } from '../../shared/interfaces';
import { SCENES } from '../../shared/scenes-wizards';
import { SceneContext } from 'telegraf/scenes';

@Injectable()
export class SceneRoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const telegrafContext = ctx.getContext<SceneContext>();
    const { from } = telegrafContext;

    const user = await this.userService.findByTelegramId(from.id);
    if (!user) {
      await this.handleUnauthorized(telegrafContext);
      return false;
    }

    // Check if it's a scene enter, wizard enter, or wizard step
    const isSceneOrWizardEnter = this.isSceneOrWizardEnter(context);
    if (!isSceneOrWizardEnter) {
      return true; // Skip check if it's not a scene/wizard enter
    }

    const allowedRoles = Reflect.getMetadata('sceneRoles', context.getClass());

    if (!allowedRoles || allowedRoles.length === 0) {
      await this.handleUnauthorized(telegrafContext);
      return false;
    }

    const hasAccess = allowedRoles.some((role: UserRole) =>
      user.role.includes(role),
    );

    if (!hasAccess) {
      await this.handleUnauthorized(telegrafContext);
      return false;
    }

    return true;
  }

  private async handleUnauthorized(ctx: SceneContext) {
    await ctx.reply('You do not have access to this function.');
    await ctx.scene.enter(SCENES.MENU);
  }

  private isSceneOrWizardEnter(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const className = context.getClass().name;

    // Check for scene enter
    if (handler.name === 'onSceneEnter') {
      return true;
    }

    // Check for wizard enter or step
    return className.toLowerCase().includes('wizard');
  }
}
