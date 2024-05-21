import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { SCENES_WIZARDS } from '../../shared/scenes-wizards';
import { ClientService } from './client.service';
import { ClientWizardHandler } from './client.wizard-handler';

@Wizard(SCENES_WIZARDS.CLIENT_ADD)
export class ClientAddWizard {
  constructor(
    @Inject(ClientService)
    readonly service: ClientService,
  ) {}

  @WizardStep(1)
  @ClientWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @ClientWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @ClientWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @ClientWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @ClientWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @ClientWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @ClientWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @ClientWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @ClientWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @ClientWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @ClientWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @ClientWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @ClientWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @ClientWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @ClientWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @ClientWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @ClientWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @ClientWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @ClientWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @ClientWizardHandler(20)
  async step20() {}
}
