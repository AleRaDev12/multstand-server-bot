import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NullableColumn } from '../nullable-column.decorator';
import { formatLabels } from '../../shared/helpers';

@Entity()
export class Client extends BaseEntity {
  public static entityName = 'Client';
  public static nullable = {
    firstName: false,
    lastName: true,
    phoneNumber: false,
    city: false,
    email: true,
    description: true,
    organization: true,
  };

  private labels = {
    firstName: 'Имя',
    lastName: 'Фамилия',
    phoneNumber: 'Телефон',
    city: 'Город',
    email: 'Email',
    organization: 'Организация',
    description: 'Описание',
    id: 'id клиента',
  };

  private labelsShorten = {
    firstName: 'Имя',
    lastName: 'Фамилия',
    phoneNumber: 'Телефон',
    city: 'Город',
    organization: 'Организация',
    description: 'Описание',
  };

  public format(): string {
    return formatLabels(this, this.labels);
  }

  public formatShorten(): string {
    return formatLabels(this, this.labelsShorten);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn()
  firstName: string;

  @NullableColumn()
  lastName: string;

  @NullableColumn()
  phoneNumber: string;

  @NullableColumn()
  city: string;

  @NullableColumn()
  email: string;

  @NullableColumn()
  description: string;

  @NullableColumn()
  organization: string;
}
