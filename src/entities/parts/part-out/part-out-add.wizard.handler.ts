import { PartOut } from './part-out.entity';
import {
  AdditionalWizardSelections,
  CustomWizardContext,
  WizardStepType,
} from '../../../shared/types';
import { PartOutAddWizard } from './part-out-add.wizard';
import { getMessage } from '../../../shared/helpers';
import { replyWithCancelButton } from '../../../bot/wizard-step-handler/utils';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import { Component } from '../component/component.entity';
import { sendMessage } from '../../../shared/sendMessages';

const standProdTypeName: AdditionalWizardSelections = 'standProdSelect';
const componentTypeName: AdditionalWizardSelections = 'componentSelect';
const partsInTypeName: AdditionalWizardSelections = 'partsInBatchSelect';

const steps: WizardStepType[] = [
  { message: 'Станок-изделие:', type: standProdTypeName },
  { message: 'Комплектующее:', type: componentTypeName },
  { message: 'Количество:', field: 'count', type: 'number' },
  { message: 'Дата списания:', field: 'date', type: 'date' },
  {
    message: 'Партия. Введите "-" для автоматического выбора.',
    type: partsInTypeName,
  },
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
  await sendMessage(ctx, `Добавлено`);
}

async function handleSpecificRequest(
  this: PartOutAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case standProdTypeName:
      const standProds = await this.standProdService.findAll();
      const formattedStandProds = standProds
        .map((standProd, index) => `№${index + 1}. ${standProd.description}`)
        .join('\n');
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${formattedStandProds}`,
      );
      return true;

    case componentTypeName:
      const remainingList = await this.partsService.getRemainingList();
      const formattedList =
        this.partsService.formatRemainingList(remainingList);

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${formattedList.map((item, index) => `№${index + 1}.\n${item}`).join('\n\n')}`,
      );
      return true;

    case partsInTypeName:
      const partsInList = await this.partsService.getRemainingListByComponent(
        ctx.wizard.state.component.id,
      );
      const formattedPartsInList =
        this.partsService.formatRemainingPartInList(partsInList);

      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${formattedPartsInList.map((item, index) => `№${index + 1}.\n${item}`).join('\n\n')}`,
      );
      return true;

    default:
      return undefined;
  }
}

async function handleSpecificAnswer(
  this: PartOutAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
): Promise<boolean> {
  const message = getMessage(ctx);

  switch (stepAnswer.type) {
    case standProdTypeName:
      return handleStandProdAnswer.call(this, ctx);

    case componentTypeName:
      const selectedNumber = parseInt(message.text);
      const remainingList = await this.partsService.getRemainingList();
      const component: Component = remainingList[selectedNumber - 1]?.component;
      if (!component) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }
      ctx.wizard.state.component = component;
      return true;

    case partsInTypeName:
      const componentId = ctx.wizard.state.component.id;
      const count = ctx.wizard.state.partOut.count;
      const date = ctx.wizard.state.partOut.date;
      const standProd = ctx.wizard.state.partOut.standProd;

      if (message.text === '-') {
        // Списать нужное количество с разных партий
        try {
          const totalRemaining =
            await this.partsService.getTotalRemainingCount(componentId);
          if (totalRemaining.inStock < count) {
            await replyWithCancelButton(
              ctx,
              'Недостаточно компонентов в остатке. Пожалуйста, начните заново.',
            );
            return false;
          }

          const partOuts = await this.partsService.writeOffComponents(
            componentId,
            count,
            date,
            standProd,
          );
          await sendMessage(
            ctx,
            `Успешно списано ${count} компонентов с ${partOuts.length} партий.`,
          );
          return true;
        } catch (error) {
          await replyWithCancelButton(ctx, `Ошибка: ${error.message}`);
          return false;
        }
      } else {
        // Списать указанное количество из выбранных партий
        const selectedNumbers = message.text
          .split(',')
          .map((num) => parseInt(num.trim()))
          .filter((num) => !isNaN(num));
        const partsInList =
          await this.partsService.getRemainingListByComponent(componentId);

        const selectedPartsIn = selectedNumbers
          .map((num) => partsInList[num - 1])
          .filter(Boolean);

        if (selectedPartsIn.length === 0) {
          await replyWithCancelButton(
            ctx,
            'Не выбрано ни одной корректной партии. Пожалуйста, выберите из списка.',
          );
          return false;
        }

        const selectedPartInIds = selectedPartsIn.map((item) => item.partIn.id);
        try {
          const partOuts = await this.partsService.writeOffFromMultiplePartIns(
            selectedPartInIds,
            count,
            date,
            standProd,
          );
          // ctx.wizard.state.partOuts = partOuts;
          await replyWithCancelButton(
            ctx,
            `Успешно списано ${count} компонентов из ${partOuts.length} выбранных партий.`,
          );
          return true;
        } catch (error) {
          await replyWithCancelButton(ctx, `Ошибка: ${error.message}`);
          return false;
        }
      }

    default:
      return true;
  }
}

export const PartOutAddWizardHandler = wizardStepHandler<PartOut>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});

async function handleStandProdAnswer(
  this: PartOutAddWizard,
  ctx: CustomWizardContext,
): Promise<boolean> {
  const message = getMessage(ctx);
  const selectedStandNumber = parseInt(message.text);
  const standProds = await this.standProdService.findAll();
  const standProd = standProds[selectedStandNumber - 1];
  if (!standProd) {
    await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
    return false;
  }
  ctx.wizard.state.partOut.standProd = standProd;
  return true;
}
