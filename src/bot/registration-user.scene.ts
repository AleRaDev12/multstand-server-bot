import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';
import { SceneRoles } from './decorators/scene-roles.decorator';
import { getMessage } from '../shared/helpers';
import { replyWithCancelButton } from './wizard-step-handler/utils';
import { sendMessage } from '../shared/sendMessages';
import { SceneContext } from 'telegraf/typings/scenes';
import { User } from '../entities/user/user.entity';

@Scene(SCENES.REGISTRATION_USER)
@SceneRoles('manager')
export class RegistrationUserScene {
  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    const requestsList = await this.userService.getRegistrationRequests();
    if (!requestsList || requestsList.length === 0) {
      await replyWithCancelButton(ctx, 'Список пуст.');
      return;
    }

    const formattedList = requestsList
      .map((request, index) => `${index + 1}. ${request.telegramUserId}`)
      .join('\n');
    await replyWithCancelButton(ctx, formattedList);
    await sendMessage(ctx, 'Введите номер и имя пользователя через запятую');
  }

  @On('text')
  async onRegister(@Ctx() ctx: Scenes.SceneContext) {
    const message = getMessage(ctx);
    const [numberString, name] = message.text
      .split(',')
      .map((substring) => substring.trim());
    const selectedNumber = parseInt(numberString);

    if (!(await this.validateInput(ctx, selectedNumber, name))) {
      return;
    }

    const requestsList = await this.userService.getRegistrationRequests();
    if (selectedNumber > requestsList.length) {
      await replyWithCancelButton(
        ctx,
        'Некорректный номер. Пожалуйста, выберите номер из списка.',
      );
      return;
    }

    await this.registerUserWithNotification(
      ctx,
      requestsList,
      selectedNumber,
      name,
    );
  }

  private async validateInput(
    ctx: Scenes.SceneContext,
    selectedNumber: number,
    name: string,
  ): Promise<boolean> {
    if (isNaN(selectedNumber) || selectedNumber < 1) {
      await replyWithCancelButton(
        ctx,
        'Некорректный номер. Пожалуйста, введите действительный номер.',
      );
      return false;
    }

    if (!name) {
      await replyWithCancelButton(
        ctx,
        'Некорректное имя. Пожалуйста, введите имя пользователя.',
      );
      return false;
    }

    return true;
  }

  private async registerUserWithNotification(
    ctx: Scenes.SceneContext,
    requestsList: User[],
    selectedNumber: number,
    name: string,
  ) {
    const selectedUser = requestsList[selectedNumber - 1];
    await this.userService.approveRequest(selectedUser.id, name);
    await sendMessage(ctx, 'Пользователь зарегистрирован.');

    await this.sendNotificationToRegisteredUser(selectedUser);

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }

  private async sendNotificationToRegisteredUser(user: User) {
    try {
      await this.bot.telegram.sendMessage(
        user.telegramUserId,
        'Ваша регистрация подтверждена. Можете нажать /start для начала работы c ботом.',
      );
    } catch (error) {
      console.error(
        `Failed to notify user about registration ${user.telegramUserId}:`,
        error,
      );
    }
  }
}
