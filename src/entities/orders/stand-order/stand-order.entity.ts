import { BaseEntity } from '../../base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';
import { formatLabels, fromValue, toKey } from '../../../shared/helpers';
import {
  Led,
  Painting,
  PaintingType,
  StandModel,
  StandModelType,
  Tripod,
  TripodType,
} from '../../unions';
import { Order } from '../order/order.entity';

@Entity()
export class StandOrder extends BaseEntity {
  public static entityName = 'StandOrder';
  public static nullable = {
    order: false,
    model: false,
    cost: true,
    painting: true,
    smartphoneMount: true,
    tripod: true,
    ledType: true,
    glassesRegular: true,
    glassesHighTransparency: true,
    dimmersCount: true,
    shadingFabric: true,
    sideWallsCount: true,
    rotaryMechanismsCount: true,
    deliveryCost: true,
  };

  private label = {
    model: 'Модель',
    cost: 'Стоимость',
    painting: 'Обработка',
    smartphoneMount: 'Монтаж смартфона',
    tripod: 'Тройник',
    ledType: 'Тип светодиодов',
    glassesRegular: 'Стёкла об',
    glassesHighTransparency: 'Стёкла пп',
    dimmersCount: 'Регуляторы яркости',
    shadingFabric: 'Ткань для затенения',
    sideWallsCount: 'Сторонние стены',
    rotaryMechanismsCount: 'Поворотные механизмы',
    deliveryCost: 'Стоимость доставки',
    id: 'id заказа',
  };

  private labelShorten = {
    model: 'Модель',
    cost: 'Стоимость',
    deliveryCost: 'Стоимость доставки',
  };

  public format(): string {
    return formatLabels(this, this.label);
  }

  public formatShorten(): string {
    return formatLabels(this, this.labelShorten);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(StandModel),
      from: fromValue(StandModel),
    },
  })
  model: StandModelType;

  @NullableColumn({ type: 'decimal' })
  cost: number;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(Painting),
      from: fromValue(Painting),
    },
  })
  painting: PaintingType;

  @NullableColumn()
  smartphoneMount: number;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(Tripod),
      from: fromValue(Tripod),
    },
  })
  tripod: TripodType;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(Led),
      from: fromValue(Led),
    },
  })
  ledType: (typeof Led)[keyof typeof Led];

  @NullableColumn()
  glassesRegular: number;

  @NullableColumn()
  glassesHighTransparency: number;

  @NullableColumn()
  dimmersCount: number;

  @NullableColumn({ type: 'int' })
  shadingFabric: number;

  @NullableColumn()
  sideWallsCount: number;

  @NullableColumn()
  rotaryMechanismsCount: number;

  @NullableColumn()
  deliveryCost: number;
}
