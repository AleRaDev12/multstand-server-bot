import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StandOrder } from '../stand-order/stand-order.entity';

@Entity()
export class StandProd {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StandOrder)
  standOrder: StandOrder;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
}
