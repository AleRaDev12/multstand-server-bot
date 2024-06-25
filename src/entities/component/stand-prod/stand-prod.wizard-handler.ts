import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../../shared/interfaces';
import { StandProd } from './stand-prod.entity';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { StandProdAddWizard } from './stand-prod-add.wizard';

const standOrderSelectType: DbEntities = 'standOrderSelect';
const entityName = 'standProd';

const steps: WizardStepType[] = [
  { message: 'Станок-заказ:', type: standOrderSelectType, field: 'standOrder' },
  { message: 'Описание:', type: 'string', field: 'description' },
];

const getEntity = (ctx: CustomWizardContext): StandProd =>
  ctx.wizard.state.standProd;
const setEntity = (ctx: CustomWizardContext): void => {
  ctx.wizard.state.standProd = new StandProd();
};
const save = function (this: StandProdAddWizard, entity: StandProd) {
  return this.service.create(entity);
};
const print = async (ctx: CustomWizardContext, entity: StandProd) => {
  await ctx.reply(`Набор характеристик станка Добавлено`);
};

async function handleSpecificAnswer(
  this: StandProdAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case standOrderSelectType: {
      // TODO: update types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ctx.update?.message as { text?: string };

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
      const standsProdList = await this.standOrderService.getListArray();
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${standsProdList}`,
      );
      return true;
    }

    default:
      return true;
  }
}

export const StandProdWizardHandler = UnifiedWizardHandler<StandProd>({
  getEntity,
  setEntity,
  save,
  print,
  handleSpecificAnswer,
  handleSpecificRequest,
  steps,
});
