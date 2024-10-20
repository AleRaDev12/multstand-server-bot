import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, EntityFieldsMap, LabelsType } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { Transaction } from '../transaction/transaction.entity';
import { UserRole } from '../../../shared/interfaces';

@Entity()
export class Account extends BaseEntity {
  public static entityName = 'Account';
  public static nullable = {
    name: false,
    description: true,
    isReal: true,
  };

  private labels: EntityFieldsMap<Account, string> = {
    name: 'Название счёта',
    description: 'Описание счёта',
    isReal: 'Учитывается ли в балансе (или виртуальный)',
    id: 'id счёта',
  };

  public format(userRole: UserRole, labelType: LabelsType = 'short'): string {
    const { name, description, isReal } = this;
    return `${name} ${description ? `(${description})` : ''} ${!isReal ? ' (вирт)' : ''}`;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn()
  name: string;

  @NullableColumn()
  description: string;

  @NullableColumn()
  isReal: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
