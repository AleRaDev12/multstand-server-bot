import { formatLabels } from '../../../shared/helpers';
import { StandOrder } from './stand-order.entity';
import { UserRole } from '../../../shared/interfaces';
import { EntityLabels, LabelsType } from '../../base.entity';

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
      id: 'Станок-заказ №',
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
      id: 'Станок-заказ №',
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
  return formatLabels(standOrder, labels[userRole][labelType]);
}
