import { formatLabels } from '../../../shared/helpers';
import { StandOrder } from './stand-order.entity';

const labels = {
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
};

const labelsShorten = {
  model: 'Модель',
  status: 'Статус',
  cost: 'Стоимость',
  deliveryCost: 'Стоимость доставки',
};

const labelsMaster = {
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
};

export function formatStandOrder(standOrder: StandOrder): string {
  return formatLabels(standOrder, labels);
}

export function formatStandOrderShorten(standOrder: StandOrder): string {
  return formatLabels(standOrder, labelsShorten);
}
