import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SCENES } from '../shared/scenes-wizards';
import { UserService } from '../entities/user/user.service';
import { CustomContext } from '../shared/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest() as CustomContext;

    if (!ctx.from) {
      console.log('*-* !ctx.from', !ctx.from);
      return false;
    }

    const telegramUserId = ctx.from.id;
    const user = await this.userService.findOneById(telegramUserId);

    if (!user) {
      await ctx.scene.enter(SCENES.REGISTRATION);
      ctx.notRegistered = true;
      return true;
    }

    if (user.role === 'unregistered') {
      await ctx.reply(
        'Ваша заявка на регистрацию находится на рассмотрении. Ожидайте.',
      );
      ctx.notRegistered = true;
      return true;
    }

    if (user.role === 'manager' || user.role === 'master') {
      const user = await this.userService.findOneById(telegramUserId);
      await ctx.reply(`Добро пожаловать, ${user.name} (роль: ${user.role}).`);
      return true;
    }

    return false;
  }
}
