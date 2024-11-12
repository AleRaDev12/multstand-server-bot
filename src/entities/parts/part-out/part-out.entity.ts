import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, LabelType } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { StandProd } from '../stand-prod/stand-prod.entity';
import { PartIn } from '../part-in/part-in.entity';
import { Work } from '../../works/work/work.entity';
import { UserRole } from '../../../shared/types';
import { formatPartOut } from './part-out-format';

@Entity()
export class PartOut extends BaseEntity {
  public static entityName = 'PartOut';
  public static nullable = {
    date: false,
    count: false,
  };

  private labels = {
    date: 'Дата списания',
    count: 'Количество',
    id: 'id списания части',
  };

  public format(userRole: UserRole, labelType: LabelType = 'short'): string {
    return formatPartOut(this, userRole);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StandProd, { nullable: true })
  standProd: StandProd;

  @ManyToOne(() => PartIn)
  partIn: PartIn;

  @ManyToOne(() => Work, { nullable: true })
  work: Work;

  @NullableColumn({ type: 'date' })
  date: Date;

  @NullableColumn({ type: 'int' })
  count: number;
}
