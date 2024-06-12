import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { StandProd } from '../stand-prod/stand-prod.entity';
import { formatLabels } from '../../../shared/helpers';
import { PartIn } from '../part-in/part-in.entity';
import { Work } from '../../work/work.entity';

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

  public format(): string {
    return formatLabels(this, this.labels);
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
