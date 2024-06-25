import { PartOut } from './part-out.entity';
import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
} from '../../../shared/interfaces';
import {
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { PartOutAddWizard } from './part-out-add.wizard';
import { Component } from '../component/component.entity';

const componentTypeName: DbEntities = 'componentSelect';
const partsInTypeName: DbEntities = 'partsInBatchSelect';

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

let selectedComponent: Component | null = null;

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
      const partsInList = await this.service.getRemainingListByComponent(
        selectedComponent.id,
      );

      await replyWithCancelButton(ctx, `${stepRequest.message}${partsInList}`);
      return true;
  }
}

async function handleSpecificAnswer(
  this: PartOutAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  // TODO: update types
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const message = ctx.update?.message as { text?: string };

  switch (stepAnswer.type) {
    case componentTypeName:
      const selectedNumber = parseInt(message.text);

      const components = await this.componentService.findAll();
      const component = components[selectedNumber - 1];
      if (!component) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      // ctx.wizard.state.partIn.component = component; // *-* check saving
      selectedComponent = component; // *-* check saving
      return true;
    case partsInTypeName:
      // const partsInList = await this.service.getListByComponent(
      //   ctx.wizard.state.partIn.component.id,
      // );

      if (message.text === '--') {
        // by order

        return false;
      }

      // const selectedNumber = parseInt(message.text);

      // await this.service.create(entity);
      return false;
  }
}

export const PartOutWizardHandler = UnifiedWizardHandler<PartOut>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
