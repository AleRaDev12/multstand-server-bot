import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, EntityFieldsMap } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Account extends BaseEntity {
  public static entityName = 'Account';
  public static nullable = {
    name: false,
    description: true,
  };

  private labels: EntityFieldsMap<Account, string> = {
    name: 'Название счёта',
    description: 'Описание счёта',
    id: 'id счёта',
  };

  public format(): string {
    const { name, description } = this;
    return `${name} ${description ? `(${description})` : ''}`;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @NullableColumn()
  description: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
