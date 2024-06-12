import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { StandOrder } from '../../orders/stand-order/stand-order.entity';

@Entity()
export class StandProd extends BaseEntity {
  public static entityName = 'StandProd';
  public static nullable = {
    standOrder: true,
    description: true,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StandOrder, { nullable: true })
  standOrder: StandOrder;

  @NullableColumn({
    type: 'text',
  })
  description: string;
}
