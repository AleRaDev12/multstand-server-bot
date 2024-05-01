import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Component } from './component.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import { generateMessage, WizardStepType } from '../../helpers';
import { ComponentsService } from './components.service';

const steps: WizardStepType[] = [
  { message: 'Название комплектующего:', field: 'name', type: 'string' },
  { message: 'Тип комплектующего:', field: 'type', type: 'string' },
  { message: 'Описание:', field: 'description', type: 'string' },
  { message: 'Ссылка:', field: 'link', type: 'string' },
  { message: 'Комментарий:', field: 'comment', type: 'string' },
];

function WizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const stepIndexCorrected = stepIndex - 2;

    descriptor.value = async function (ctx: CustomWizardContext) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = ctx.update?.message;
      const step = steps[stepIndexCorrected];

      if (!msg?.text) {
        return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
      }

      ctx.wizard.state.component[step.field] = msg.text;

      if (stepIndexCorrected === steps.length - 1) {
        const component = await this.componentsService.create(
          ctx.wizard.state.component,
        );
        await ctx.scene.leave();
        return `Комплектующее ${JSON.stringify(component, null, 2)} добавлено.`;
      } else {
        ctx.wizard.next();
        return generateMessage(steps[stepIndexCorrected + 1]);
      }
    };

    return descriptor;
  };
}

@Wizard(WIZARDS.ADD_COMPONENT)
export class ComponentsAddWizard {
  constructor(
    @Inject(ComponentsService)
    private readonly componentsService: ComponentsService,
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.component = new Component();
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

  @On('text')
  @WizardStep(5)
  @WizardStepHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @WizardStepHandler(6)
  async step6() {}
}
