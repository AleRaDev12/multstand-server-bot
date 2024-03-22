import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { getValueByIndex, printEnum, Stand, StandModel } from './stand.entity';
import { StandsService } from './stands.service';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards'; // Новый импорт

@Wizard(WIZARDS.ADD_STAND_WIZARD_ID)
export class StandAddWizard {
  constructor(
    @Inject(StandsService)
    private readonly usersService: StandsService,
  ) {}

  @WizardStep(1)
  async s1(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.stand = new Stand();
    await ctx.wizard.next();
    return `Модель:\n${printEnum(StandModel)}`;
  }

  @On('text')
  @WizardStep(2)
  async s2(
    @Ctx() ctx: CustomWizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    ctx.wizard.state.stand.model = getValueByIndex(StandModel, +msg.text - 1);
    const stand = await this.usersService.create(ctx.wizard.state.stand);

    await ctx.scene.leave();

    return `Станок ${JSON.stringify(stand, null, 2)} добавлен`;
  }
}
