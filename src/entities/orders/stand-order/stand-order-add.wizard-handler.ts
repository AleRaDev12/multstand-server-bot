import { Led, Painting, StandModel, Tripod } from '../../unions';
import {
  CustomWizardContext,
  AdditionalWizardSelections,
  WizardStepType,
  WizardStepTypeN,
} from '../../../shared/interfaces';
import { StandOrder } from './stand-order.entity';

import { StandOrderAddWizard } from './stand-order-add.wizard';
import { getMessage, printUnion } from '../../../shared/helpers';
import { StandOrderStatus } from './stand-order-types';
import { wizardStepHandler } from '../../../bot/wizard-step-handler/wizardStepHandler';
import {
  handleAnswerUnion,
  replyWithCancelButton,
} from '../../../bot/wizard-step-handler/utils';
import { sendMessage } from '../../../shared/senMessages';

const orderSelectType: AdditionalWizardSelections = 'orderSelect';
const orderModelSelectType: AdditionalWizardSelections = 'orderModelSelect';
const entityName = 'standOrder';

const commonSteps: WizardStepTypeN<StandOrder>[] = [
  { message: 'Выберите заказ:', type: orderSelectType },
  {
    message: 'Статус:',
    field: 'status',
    type: 'union',
    union: StandOrderStatus,
  },
  {
    message: 'Модель:',
    type: orderModelSelectType,
  },
  {
    message: 'Стоимость:',
    field: 'cost',
    type: 'number',
  },
  {
    message: 'Тип обработки:',
    field: 'painting',
    type: 'union',
    union: Painting,
  },
  {
    message: 'Крепление для смартфона (количество):',
    field: 'smartphoneMount',
    type: 'number',
  },
  {
    message: 'Штатив для объёмной анимации:',
    field: 'tripod',
    type: 'union',
    union: Tripod,
  },
  {
    message: 'Тип светодиодной ленты:',
    field: 'ledType',
    type: 'union',
    union: Led,
  },
];

const tmtlSteps: WizardStepType[] = [
  {
    message: 'Количество стёкол обычных:',
    field: 'glassesRegular',
    type: 'number',
  },
  {
    message: 'Количество стёкол повышенной прозрачности:',
    field: 'glassesHighTransparency',
    type: 'number',
  },
  {
    message: 'Количество регуляторов яркости:',
    field: 'dimmersCount',
    type: 'number',
  },
  {
    message: 'Наличие ткани для затенения (да/нет):',
    field: 'shadingFabric',
    type: 'boolean',
  },
];

const threeDSteps: WizardStepType[] = [
  {
    message: 'Количество боковых стенок:',
    field: 'sideWallsCount',
    type: 'number',
  },
  {
    message: 'Количество поворотных механизмов:',
    field: 'rotaryMechanismsCount',
    type: 'number',
  },
];

function getEntity(ctx: CustomWizardContext): StandOrder {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new StandOrder();
}

function save(this: StandOrderAddWizard, entity: StandOrder) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: StandOrder,
): Promise<void> {
  await sendMessage(ctx, `Набор характеристик станка добавлен`);
}

async function handleSpecificRequest(
  this: StandOrderAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case orderSelectType: {
      const ordersList = await this.orderService.getFormattedList();
      if (!ordersList) {
        await sendMessage(ctx, 'Записей нет');
        return true;
      }

      for (const order of ordersList) {
        await sendMessage(ctx, order);
      }

      await replyWithCancelButton(ctx, '-');
      return true;
    }

    case orderModelSelectType: {
      await replyWithCancelButton(
        ctx,
        `${stepRequest.message}\n${printUnion(StandModel)}`,
      );
      return true;
    }
  }

  if (stepRequest.type !== orderSelectType) return false;
}

async function handleSpecificAnswer(
  this: StandOrderAddWizard,
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: StandOrder,
): Promise<boolean> {
  switch (stepAnswer.type) {
    case orderSelectType: {
      const message = getMessage(ctx);

      const selectedNumber = parseInt(message.text);

      const standsOrder = await this.orderService.findAll();
      const standOrder = standsOrder[selectedNumber - 1];
      if (!standOrder) {
        await replyWithCancelButton(ctx, 'Не найдено. Выберите из списка.');
        return false;
      }

      ctx.wizard.state[entityName].order = standOrder;
      return true;
    }

    case orderModelSelectType: {
      const result = await handleAnswerUnion(ctx, 'model', StandModel, entity);
      if (!result) return false;

      switch (entity.model) {
        case StandModel.mTM15:
        case StandModel.mTL15:
          ctx.wizard.state.steps.push(...tmtlSteps);
          break;
        case StandModel.m3DM5:
        case StandModel.m3DL5:
          ctx.wizard.state.steps.push(...threeDSteps);
          break;
      }
      return true;
    }
  }
}

export const StandOrderAddWizardHandler = wizardStepHandler<StandOrder>({
  getEntity,
  setEntity,
  save,
  print,
  initialSteps: commonSteps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
