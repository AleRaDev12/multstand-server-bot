import { StandOrder } from '../stand-order/stand-order.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';

@Entity()
export class StandProd extends BaseEntity {
  public static entityName = 'StandProd';
  public static nullable = {
    description: true,
    standOrder: true,
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
