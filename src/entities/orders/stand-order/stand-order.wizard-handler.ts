import { Led, Painting, StandModel, Tripod } from '../../unions';
import {
  CustomWizardContext,
  DbEntities,
  WizardStepType,
  WizardStepTypeN,
} from '../../../shared/interfaces';
import { StandOrder } from './stand-order.entity';
import {
  handleAnswerUnion,
  replyWithCancelButton,
  UnifiedWizardHandler,
} from '../../../UnifiedWizardHandler';
import { StandOrderAddWizard } from './stand-order-add.wizard';
import { getMessage, printUnion } from '../../../shared/helpers';

const orderSelectType: DbEntities = 'orderSelect';
const orderModelSelectType: DbEntities = 'orderModelSelect';
const entityName = 'standOrder';

const commonSteps: WizardStepTypeN<StandOrder>[] = [
  { message: 'Выберите заказ:', type: orderSelectType },
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
    union: { ...Tripod },
  },
  {
    message: 'Тип светодиодной ленты:',
    field: 'ledType',
    type: 'union',
    union: { ...Led },
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

const steps: WizardStepType[] = [...commonSteps];

function getEntity(ctx: CustomWizardContext): StandOrder {
  return ctx.wizard.state[entityName];
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state[entityName] = new StandOrder();
}

function save(this: StandOrderAddWizard, entity: StandOrder) {
  steps.length = 0;
  steps.push(...commonSteps);
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: StandOrder,
): Promise<void> {
  await ctx.reply(`Набор характеристик станка Добавлено`);
}

async function handleSpecificRequest(
  this: StandOrderAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  switch (stepRequest.type) {
    case orderSelectType: {
      const ordersList = await this.orderService.getListArray();
      if (!ordersList) {
        await ctx.reply('Записей нет');
        return true;
      }

      for (const order of ordersList) {
        await ctx.reply(order);
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
          steps.push(...tmtlSteps);
          break;
        case StandModel.m3DM5:
        case StandModel.m3DL5:
          steps.push(...threeDSteps);
          break;
      }
      return true;
    }
  }
}

export const StandOrderWizardHandler = UnifiedWizardHandler<StandOrder>({
  getEntity,
  setEntity,
  save,
  print,
  steps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
