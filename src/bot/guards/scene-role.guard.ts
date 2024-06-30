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
    const handler = context.getHandler();
    const className = context.getClass().name;

    const ctx = TelegrafExecutionContext.create(context);
    const telegrafContext = ctx.getContext<SceneContext>();

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
      console.log('*-* handleUnregistered');
      return true;
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

  private async handleUndefinedRoles(ctx: SceneContext, className: string) {
    await ctx.reply(
      `Ограничения ролей для сцены (${className}) не определены.`,
    );
    await ctx.scene.enter(SCENES.MENU);
  }

  private async handleUnauthorized(ctx: SceneContext) {
    await ctx.reply(`У вас нет доступа к данной функции.`);
    await ctx.scene.enter(SCENES.MENU);
  }

  private async handleUnregistered(ctx: SceneContext) {
    await ctx.reply(`Вы не зарегистрированы.`);
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
