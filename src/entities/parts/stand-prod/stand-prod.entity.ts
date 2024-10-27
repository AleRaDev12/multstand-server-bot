import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StandOrder } from '../../orders/stand-order/stand-order.entity';
import { Work } from '../../works/work/work.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { UserRole } from '../../../shared/types';
import { formatStandProd } from './stand-prod-formatting';
import { BaseEntity, LabelType } from '../../base.entity';
import { PartOut } from '../part-out/part-out.entity';

@Entity()
export class StandProd extends BaseEntity {
  public static entityName = 'StandProd';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StandOrder, { nullable: true })
  standOrder: StandOrder;

  @OneToMany(() => PartOut, (partOut) => partOut.standProd)
  partsOut: PartOut[];

  @OneToMany(() => Work, (work) => work.standProd)
  work: Work[];

  @NullableColumn({
    type: 'text',
  })
  description: string;

  @NullableColumn({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  public static nullable = {
    standOrder: true,
    description: true,
    isActive: false,
  };

  public format(userRole: UserRole, labelType: LabelType = 'short'): string {
    return formatStandProd(this, userRole, labelType);
  }
}
