import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Master } from './master.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/scenes-wizards';
import { generateMessage } from '../../shared/helpers';
import { MasterService } from './master.service';

const steps: WizardStepType[] = [
  { message: 'Имя мастера:', field: 'name', type: 'string' },
  {
    message: 'Коэффициент оплаты:',
    field: 'paymentCoefficient',
    type: 'number',
  },
  { message: 'Роль:', field: 'role', type: 'string' },
];

function WizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // const stepIndexCorrected = stepIndex - 2;
    //
    // descriptor.value = async function (ctx: CustomWizardContext) {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-expect-error
    //   const msg = ctx.update?.message;
    //   const step = steps[stepIndexCorrected];
    //
    //   if (!msg?.text) {
    //     return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
    //   }
    //
    //   switch (step.type) {
    //     case 'number':
    //       const number = parseFloat(msg.text);
    //       if (!isNaN(number)) {
    //         ctx.wizard.state.master[step.field] = number;
    //       } else {
    //         return 'Введите корректное числовое значение.';
    //       }
    //       break;
    //     default:
    //       ctx.wizard.state.master[step.field] = msg.text;
    //       break;
    //   }
    //
    //   if (stepIndexCorrected === steps.length - 1) {
    //     const master = await this.mastersService.create(
    //       ctx.wizard.state.master,
    //     );
    //     await ctx.scene.leave();
    //     return `Мастер ${JSON.stringify(master, null, 2)} добавлен.`;
    //   } else {
    //     ctx.wizard.next();
    //     return generateMessage(steps[stepIndexCorrected + 1]);
    //   }
    // };
    //
    // return descriptor;
  };
}

@Wizard(WIZARDS.ADD_MASTER)
export class MasterAddWizard {
  constructor(
    @Inject(MasterService)
    private readonly mastersService: MasterService,
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.master = new Master();
    ctx.wizard.next();
    return generateMessage(steps[0]);
  }

  @On('text')
  @WizardStep(2)
  @WizardStepHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @WizardStepHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @WizardStepHandler(4)
  async step4() {}
}
