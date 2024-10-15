import { BaseEntity, EntityFieldsMap, LabelsType } from '../../base.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
import { StandOrderStatus, StandOrderStatusType } from './stand-order-types';
import { formatStandOrder } from './stand-order-formatting';
import { UserRole } from '../../../shared/interfaces';
import { StandProd } from '../../parts/stand-prod/stand-prod.entity';

@Entity()
export class StandOrder extends BaseEntity {
  public static entityName = 'StandOrder';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @OneToMany(() => StandProd, (standProd) => standProd.standOrder)
  standProd: StandProd[];

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(StandOrderStatus),
      from: fromValue(StandOrderStatus),
    },
  })
  status: StandOrderStatusType;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(StandModel),
      from: fromValue(StandModel),
    },
  })
  model: StandModelType;

  @NullableColumn({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
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

  @NullableColumn()
  description: string;

  public static nullable: EntityFieldsMap<StandOrder, boolean> = {
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
    status: false,
    description: true,
  };

  public format(userRole: UserRole, labelType: LabelsType = 'short'): string {
    return formatStandOrder(this, userRole, labelType);
  }
}
