import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity, LabelsType } from '../base.entity';
import { User } from '../user/user.entity';
import { UserRole } from '../../shared/interfaces';

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

  @NullableColumn({ type: 'decimal', precision: 4, scale: 2 })
  paymentCoefficient: number;

  public format(userRole: UserRole, labelType?: LabelsType): string {
    return `Not implemented yet for ${this.constructor.name}`;
  }
}
