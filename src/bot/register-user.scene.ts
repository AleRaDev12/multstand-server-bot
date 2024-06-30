import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { UserService } from '../entities/user/user.service';
import { SceneRoles } from './decorators/scene-roles.decorator';
import { getMessage } from '../shared/helpers';
import { replyWithCancelButton } from './wizard-step-handler/utils';

@Scene(SCENES.REGISTER)
@SceneRoles('manager')
export class RegisterUserScene {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    const requestsList = await this.userService.getRegistrationRequests();
    await ctx.reply(
      requestsList
        .map((request, index) => `${index + 1}. ${request.telegramUserId}`)
        .join('\n'),
    );
    await ctx.reply('Введите номер и имя пользователя через запятую');
  }

  @On('text')
  async onRegister(@Ctx() ctx: Scenes.SceneContext) {
    const message = getMessage(ctx);
    const enteredValues = message.text.split(',');

    if (enteredValues.length !== 2) {
      await replyWithCancelButton(
        ctx,
        'Некорректный ввод. Пожалуйста, введите номер и имя пользователя через запятую.',
      );
      return;
    }

    const selectedNumber = parseInt(enteredValues[0].trim());
    const name = enteredValues[1].trim();

    if (isNaN(selectedNumber) || selectedNumber < 1) {
      await replyWithCancelButton(
        ctx,
        'Некорректный номер. Пожалуйста, введите действительный номер.',
      );
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

    if (!name) {
      await replyWithCancelButton(
        ctx,
        'Некорректное имя. Пожалуйста, введите имя пользователя.',
      );
      return;
    }

    const selectedUser = requestsList[selectedNumber - 1];

    await this.userService.approveRequest(selectedUser.id, name);
    await ctx.reply('Пользователь зарегистрирован.');
    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
