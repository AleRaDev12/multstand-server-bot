import {
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StandOrder } from '../../orders/stand-order/stand-order.entity';
import { Work } from '../../works/work/work.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { UserRole } from '../../../shared/interfaces';
import { formatStandProd } from './stand-prod-formatting';
import { BaseEntity, LabelsType } from '../../base.entity';
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

  @ManyToMany(() => Work, (work) => work.standProd)
  work: Work[];

  @NullableColumn({
    type: 'text',
  })
  description: string;

  public static nullable = {
    standOrder: true,
    description: true,
  };

  public format(userRole: UserRole, labelType: LabelsType = 'short'): string {
    return formatStandProd(this, userRole, labelType);
  }
}
