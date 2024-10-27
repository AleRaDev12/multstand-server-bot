import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity, LabelType } from '../base.entity';
import { User } from '../user/user.entity';
import { UserRole } from '../../shared/types';

@Entity()
export class Master extends BaseEntity {
  public static entityName = 'Master';
  public static nullable = {
    paymentCoefficient: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @NullableColumn({
    type: 'decimal',
    precision: 4,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  paymentCoefficient: number;

  public format(userRole: UserRole, labelType?: LabelType): string {
    return `Not implemented yet for ${this.constructor.name}`;
  }
}
