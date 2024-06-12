import { BaseEntity } from '../../base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';
import { fromValue, toKey } from '../../../shared/helpers';
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

  public format(): string {
    const formattedValues: string[] = [];

    if (this.model) formattedValues.push(`Модель: ${this.model}`);
    if (this.cost) formattedValues.push(`Стоимость: ${this.cost}`);
    if (this.deliveryCost)
      formattedValues.push(`Стоимость доставки: ${this.deliveryCost}`);
    if (this.painting) formattedValues.push(`Обработка: ${this.painting}`);
    if (this.ledType) formattedValues.push(`Тип светодиодов: ${this.ledType}`);
    if (this.glassesRegular)
      formattedValues.push(`Стёкла об: ${this.glassesRegular}`);
    if (this.glassesHighTransparency)
      formattedValues.push(`Стёкла пп: ${this.glassesHighTransparency}`);
    if (this.dimmersCount)
      formattedValues.push(`Регуляторы яркости: ${this.dimmersCount}`);
    if (this.shadingFabric)
      formattedValues.push(`Ткань для затенения: ${this.shadingFabric}`);
    if (this.sideWallsCount)
      formattedValues.push(`Количество боковых стенок: ${this.sideWallsCount}`);
    if (this.rotaryMechanismsCount)
      formattedValues.push(
        `Количество вращающихся механизмов: ${this.rotaryMechanismsCount}`,
      );
    if (this.smartphoneMount)
      formattedValues.push(`Крепление для смартфона: ${this.smartphoneMount}`);
    if (this.tripod) formattedValues.push(`Штатив: ${this.tripod}`);

    return formattedValues.join('\n');
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
