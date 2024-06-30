import { BaseEntity } from '../../base.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';
import { formatLabels } from '../../../shared/helpers';

@Entity()
export class Component extends BaseEntity {
  public static entityName = 'Component';
  public static nullable = {
    name: false,
    type: true,
    description: true,
    link: true,
    comment: true,
  };

  private labels = {
    name: 'Наименование',
    type: 'Тип',
    description: 'Описание',
    link: 'Ссылка',
    comment: 'Комментарий',
    id: 'id компонента',
  };

  public format(): string {
    return formatLabels(this, this.labels);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn()
  name: string;

  @NullableColumn()
  type: string;

  @NullableColumn()
  description: string;

  @NullableColumn()
  link: string;

  @NullableColumn()
  comment: string;
}
