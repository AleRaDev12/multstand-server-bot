import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../entities/user/user.service';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { SceneContext, SceneSessionData } from 'telegraf/scenes';
import { UserRole } from '../../shared/interfaces';
import { SCENES } from '../../shared/scenes-wizards';
import { sendMessage } from '../../shared/senMessages';

export interface ExtendedSceneSessionData extends SceneSessionData {
  userRole?: UserRole;
}

@Injectable()
export class SceneRoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const className = context.getClass().name;

    const ctx = TelegrafExecutionContext.create(context);
    const telegrafContext = ctx.getContext<
      SceneContext & { session: ExtendedSceneSessionData }
    >();

    // Check if it's a scene enter, wizard enter, or wizard step
    const isSceneOrWizardEnter = this.isSceneOrWizardEnter(
      handler.name,
      className,
    );
    if (!isSceneOrWizardEnter) {
      return true; // Skip check if it's not a scene/wizard enter
    }

    const allowedRoles = Reflect.getMetadata('sceneRoles', context.getClass());

    if (!allowedRoles || allowedRoles.length === 0) {
      await this.handleUndefinedRoles(telegrafContext, className);
      return true;
    }

    if (allowedRoles.some((role: UserRole) => role === 'unknown')) {
      return true;
    }

    const { from } = telegrafContext;
    const user = await this.userService.findByTelegramId(from.id);
    if (!user) {
      await this.handleUnregistered(telegrafContext);
      return true;
    }

    const hasAccess = allowedRoles.some((role: UserRole) =>
      user.role.includes(role),
    );

    if (!hasAccess) {
      await this.handleUnauthorized(telegrafContext);
      return false;
    }

    // Save the role in session context
    telegrafContext.session.userRole = user.role;

    return true;
  }

  private async handleUndefinedRoles(ctx: SceneContext, className: string) {
    await sendMessage(
      ctx,
      `Ограничения ролей для сцены (${className}) не определены.`,
    );
    await ctx.scene.enter(SCENES.MENU);
  }

  private async handleUnauthorized(ctx: SceneContext) {
    await sendMessage(ctx, `У вас нет доступа к данной функции.`);
    await ctx.scene.enter(SCENES.MENU);
  }

  private async handleUnregistered(ctx: SceneContext) {
    await sendMessage(ctx, `Вы не зарегистрированы.`);
    await ctx.scene.enter(SCENES.REGISTRATION);
  }

  private isSceneOrWizardEnter(
    handlerName: string,
    className: string,
  ): boolean {
    // Check for scene enter
    if (handlerName === 'onSceneEnter') {
      return true;
    }

    // Check for wizard enter or step
    return className.toLowerCase().includes('wizard');
  }
}
