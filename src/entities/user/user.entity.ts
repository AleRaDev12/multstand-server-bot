import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity, LabelType } from '../base.entity';
import { UserRole } from '../../shared/types';
import { Master } from '../master/master.entity';

@Entity()
export class User extends BaseEntity {
  public static entityName = 'User';
  public static nullable = {
    name: true,
    role: false,
    telegramUserId: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn()
  name: string;

  @NullableColumn({ unique: true, type: 'bigint' })
  telegramUserId: number;

  @NullableColumn()
  role: UserRole;

  @OneToOne(() => Master, (master) => master.user)
  master: Master;

  public format(userRole: UserRole, labelType?: LabelType): string {
    return `Not implemented yet for ${this.constructor.name}`;
  }
}
