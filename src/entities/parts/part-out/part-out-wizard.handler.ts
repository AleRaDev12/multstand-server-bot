import { PartOut } from './part-out.entity';
import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/interfaces';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { PartOutAddWizard } from './part-out-add.wizard';
import { getMessage } from '../../../shared/helpers';

const componentTypeName: AdditionalWizardSelections = 'componentSelect';
const partsInTypeName: AdditionalWizardSelections = 'partsInBatchSelect';

const steps: WizardStepType[] = [
  { message: 'Комплектующее:', type: componentTypeName },
  { message: 'Партия:', type: partsInTypeName },
  { message: 'Дата списания:', field: 'date', type: 'date' },
  { message: 'Количество:', field: 'count', type: 'number' },
];

function getEntity(ctx: CustomWizardContext): PartOut {
  return ctx.wizard.state.partOut;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.partOut = new PartOut();
}

function save() {
  return undefined;
}

async function print(ctx: CustomWizardContext, entity: PartOut): Promise<void> {
  await ctx.reply(`Добавлено`);
}

async function handleSpecificRequest(
  this: PartOutAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case componentTypeName:
      const componentsList = await this.componentService.getList();
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}${componentsList}`,
      );
      return true;
    case partsInTypeName:
      // const partsInList = await this.service.getRemainingListByComponent(
      //   selectedComponent.id,
      // );
      //
      // await replyWithCancelButton(ctx, `${stepRequest.message}${partsInList}`);
      return true;
  }
}

async function handleSpecificAnswer(
  this: PartOutAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  const message = getMessage(ctx);
  const selectedNumber = parseInt(message.text);

  switch (stepAnswer.type) {
    case componentTypeName:
      const componentList = await this.componentService.findAll();
      const component = componentList[selectedNumber - 1];
      if (!component) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state.partIn.component = component;
      return true;
    case partsInTypeName:
      const partsInList = await this.service.getListByComponent(
        ctx.wizard.state.partIn.component.id,
      );
      const selectedPartIn = partsInList[selectedNumber - 1];
      if (!selectedPartIn) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      if (message.text === '--') {
        // by order

        return false;
      }

      // await this.service.create(entity);
      return false;
  }
}

export const PartOutWizardHandler = UnifiedWizardHandler<PartOut>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
