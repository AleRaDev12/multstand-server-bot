import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import { StandProd } from './stand-prod.entity';
import { StandProdAddWizard } from './stand-prod-add.wizard';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';

const standOrderSelectType: AdditionalWizardSelections = 'standOrderSelect';
const entityName = 'standProd';

const steps: WizardStepType[] = [
  { message: 'Станок-заказ:', type: standOrderSelectType, field: 'standOrder' },
  { message: 'Описание:', type: 'string', field: 'description' },
];

function getEntity(ctx: CustomWizardContext): StandProd {
  return ctx.wizard.state.standProd;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.standProd = new StandProd();
}

function save(this: StandProdAddWizard, entity: StandProd) {
  return this.service.create(entity);
}

async function print(ctx: CustomWizardContext, entity: StandProd) {
  await ctx.reply(`Набор характеристик станка добавлен`);
}

async function handleSpecificAnswer(
  this: StandProdAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case standOrderSelectType: {
      const message = getMessage(ctx);

      const selectedNumber = parseInt(message.text);

      const standsOrder = await this.standOrderService.findAll();
      const standOrder = standsOrder[selectedNumber - 1];
      if (!standOrder) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].standOrder = standOrder;
      return true;
    }

    default:
      return true;
  }
}

async function handleSpecificRequest(
  this: StandProdAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case standOrderSelectType: {
      const standsProdList = await this.standOrderService.findAll();
      const formattedList = await this.standOrderService.formatList(
        standsProdList,
        ctx.userRole,
      );

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${formattedList}`,
      );
      return true;
    }

    default:
      return true;
  }
}

export const StandProdAddWizardHandler = wizardStepHandler<StandProd>({
  getEntity,
  setEntity,
  save,
  print,
  handleSpecificAnswer,
  handleSpecificRequest,
  initialSteps: steps,
});
