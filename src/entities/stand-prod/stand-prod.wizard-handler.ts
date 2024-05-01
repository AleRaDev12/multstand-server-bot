import {
  generateMessage,
  getValueUnionByIndex,
  WizardStepType,
} from '../../helpers';
import { LedStripModel, Painting, StandModel, Tripod } from '../unions';
import { CustomWizardContext } from '../../shared/interfaces';
import { StandProd } from './stand-prod.entity';
import { SCENES } from '../../shared/wizards';
import { UnifiedWizardHandler } from '../../UnifiedWizardHandler';

const standProdSteps: WizardStepType[] = [
  { message: 'Модель:', field: 'model', union: StandModel, type: 'union' },
  {
    message: 'Покраска:',
    field: 'painting',
    union: Painting,
    type: 'union',
  },
  {
    message: 'Количество обычных стёкол:',
    field: 'glassesRegular',
    type: 'number',
  },
  {
    message: 'Количество стёкол пп:',
    field: 'glassesHighTransparency',
    type: 'number',
  },
  {
    message: 'Светодиодная лента:',
    field: 'ledStripModel',
    union: LedStripModel,
    type: 'union',
  },
  { message: 'Ткань для затенения:', field: 'shadingFabric', type: 'number' },
  {
    message: 'Штатив для объёмной анимации:',
    field: 'tripod',
    type: 'union',
    union: Tripod,
  },
];

const steps = standProdSteps;

const getEntity = (ctx: CustomWizardContext): StandProd =>
  ctx.wizard.state.standProd;
const setEntity = (ctx: CustomWizardContext): void => {
  ctx.wizard.state.standProd = new StandProd();
};
const save = function (entity: StandProd) {
  return this.service.create(entity);
};
const print = async (ctx: CustomWizardContext, entity: StandProd) => {
  await ctx.reply(
    `Набор характеристик станка ${JSON.stringify(entity, null, 2)} добавлен`,
  );
};

export const StandProdWizardHandler = UnifiedWizardHandler<StandProd>(
  getEntity,
  setEntity,
  save,
  print,
  standProdSteps,
);
