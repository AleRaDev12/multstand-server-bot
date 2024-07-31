import { formatLabels } from '../../../shared/helpers';
import { StandOrder } from './stand-order.entity';
import { UserRole } from '../../../shared/interfaces';
import { EntityLabels, LabelsType } from '../../base.entity';
import { Tripod } from '../../unions';

const labels: EntityLabels<StandOrder, string> = {
  manager: {
    short: {
      model: 'Модель',
      status: 'Статус',
      cost: 'Стоимость',
      deliveryCost: 'Стоимость доставки',
    },
    full: {
      model: 'Модель',
      status: 'Статус заказа',
      cost: 'Стоимость',
      deliveryCost: 'Стоимость доставки',
      painting: 'Обработка',
      smartphoneMount: 'Крепление для смартфона',
      tripod: 'Штатив',
      ledType: 'Тип светодиодов',
      glassesRegular: 'Стёкла об',
      glassesHighTransparency: 'Стёкла пп',
      dimmersCount: 'Регуляторы яркости',
      shadingFabric: 'Ткань для затенения',
      sideWallsCount: 'Боковые стенки',
      rotaryMechanismsCount: 'Поворотные механизмы',
      id: 'id заказа',
    },
  },
  master: {
    short: {
      model: 'Модель',
      painting: 'Обработка',
      glassesRegular: 'Стёкла об',
      glassesHighTransparency: 'Стёкла пп',
      ledType: 'Тип светодиодов',
      dimmersCount: 'Регуляторы яркости',
      shadingFabric: 'Ткань для затенения',
      smartphoneMount: 'Крепление для смартфона',
      tripod: 'Штатив',
      sideWallsCount: 'Боковые стенки',
      rotaryMechanismsCount: 'Поворотные механизмы',
    },
    full: {
      model: 'Модель',
      painting: 'Обработка',
      glassesRegular: 'Стёкла об',
      glassesHighTransparency: 'Стёкла пп',
      ledType: 'Тип светодиодов',
      dimmersCount: 'Регуляторы яркости',
      shadingFabric: 'Ткань для затенения',
      smartphoneMount: 'Крепление для смартфона',
      tripod: 'Штатив',
      sideWallsCount: 'Боковые стенки',
      rotaryMechanismsCount: 'Поворотные механизмы',
    },
  },
};

export function formatStandOrder(
  standOrder: StandOrder,
  userRole: UserRole,
  labelType: LabelsType,
): string {
  if (labelType === 'line') {
    return formatStandOrderLine(standOrder, userRole);
  }
  return formatLabels(standOrder, labels[userRole ?? 'master'][labelType]);
}

function formatStandOrderLine(
  standOrder: StandOrder,
  userRole: UserRole,
): string {
  const parts = [
    standOrder.model,
    typeof standOrder.glassesRegular === 'number' &&
      `${standOrder.glassesRegular}стОб`,
    typeof standOrder.glassesHighTransparency === 'number' &&
      `${standOrder.glassesHighTransparency}стПп`,
    standOrder.painting,
    standOrder.ledType,
    standOrder.dimmersCount && `${standOrder.dimmersCount}рег`,
    standOrder.shadingFabric && `${standOrder.shadingFabric}ткань`,
    standOrder.smartphoneMount && `${standOrder.smartphoneMount}смарт`,
    standOrder.tripod && standOrder.tripod !== Tripod.No && standOrder.tripod,
    userRole === 'manager' && standOrder.cost,
    userRole === 'manager' && standOrder.deliveryCost,
    standOrder.sideWallsCount && `${standOrder.sideWallsCount}бок`,
    standOrder.rotaryMechanismsCount &&
      `${standOrder.rotaryMechanismsCount}пов`,
  ];

  return parts.filter(Boolean).join(' ');
}
