import { BaseEntity } from '../../base.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';

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
