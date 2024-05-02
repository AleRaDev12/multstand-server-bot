import { WizardStepType } from '../../helpers';
import { Led, Painting, StandModel, Tripod } from '../unions';
import { CustomWizardContext } from '../../shared/interfaces';
import { StandOrder } from './stand-order.entity';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';
import { StandOrderAddWizard } from './stand-order-add.wizard';

const commonSteps: WizardStepType[] = [
  { message: 'Выберите заказ:', type: 'orderSelect' },
  { message: 'Модель:', field: 'model', type: 'union', union: StandModel },
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

const standOrderSteps: WizardStepType[] = [...commonSteps];

function getEntity(ctx: CustomWizardContext): StandOrder {
  return ctx.wizard.state.standOrder;
}

function setEntity(ctx: CustomWizardContext): void {
  ctx.wizard.state.standOrder = new StandOrder();
}

function save(entity: StandOrder) {
  return this.service.create(entity);
}

async function print(
  ctx: CustomWizardContext,
  entity: StandOrder,
): Promise<void> {
  await ctx.reply(
    `Набор характеристик станка ${JSON.stringify(entity, null, 2)} добавлен`,
  );
}

async function handleSpecificAnswer(
  ctx: CustomWizardContext,
  stepAnswer: WizardStepType,
  entity: StandOrder,
): Promise<boolean> {
  switch (stepAnswer.field) {
    case 'model':
      switch (entity.model) {
        case StandModel.mTM15:
        case StandModel.mTL15:
          standOrderSteps.push(...tmtlSteps);
          break;
        case StandModel.m3DM5:
        case StandModel.m3DL5:
          standOrderSteps.push(...threeDSteps);
          break;
      }
      break;
  }
  return true;
}

async function handleSpecificRequest(
  this: StandOrderAddWizard,
  ctx: CustomWizardContext,
  stepRequest: WizardStepType,
): Promise<boolean> {
  if (stepRequest.type !== 'orderSelect') return false;

  const ordersList = await this.orderService.getList();
  await ctx.reply(`${stepRequest.message}\n${ordersList}`);
  return true;
}

export const StandOrderWizardHandler = UnifiedWizardHandler<StandOrder>({
  getEntity,
  setEntity,
  save,
  print,
  steps: standOrderSteps,
  handleSpecificAnswer,
  handleSpecificRequest,
});
