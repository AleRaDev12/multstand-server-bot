import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SCENES } from '../shared/scenes-wizards';
import { UserService } from '../entities/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest();

    // Если нет контекста от Telegram, пропускаем Guard
    if (!ctx.from) {
      console.log('*-* !ctx.from', !ctx.from);
      return true;
    }

    const telegramUserId = ctx.from.id;
    const user = await this.userService.findOneById(telegramUserId);

    // Проверка, если пользователь уже в сцене регистрации, пропускаем guard
    if (
      ctx.scene &&
      ctx.scene.current &&
      (ctx.scene.current.id === SCENES.UNREGISTERED ||
        ctx.scene.current.id === SCENES.REGISTER)
    ) {
      return true;
    }

    if (!user || user.role === 'unregistered') {
      await ctx.reply(
        'Вы не зарегистрированы. Отправьте заявку на регистрацию.',
      );
      await ctx.scene.enter(SCENES.UNREGISTERED);
      return false;
    }

    if (user.role === 'manager') {
      await ctx.reply('Вы менеджер.');
      await ctx.scene.enter(SCENES.MENU);
      return true;
    }

    if (user.role === 'master') {
      await ctx.reply('Добро пожаловать, мастер.');
      await ctx.reply('Приветствие');
      return true;
    }

    return false;
  }
}
