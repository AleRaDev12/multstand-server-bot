import { StandOrder } from '../stand-order/stand-order.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';

@Entity()
export class StandProd extends BaseEntity {
  public static entityName = 'StandProd';
  public static nullable = {
    standOrder: false,
    description: true,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StandOrder)
  standOrder: StandOrder;

  @NullableColumn({
    type: 'text',
  })
  description: string;
}
