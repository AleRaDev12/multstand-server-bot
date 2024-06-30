import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity } from '../base.entity';
import { UserRole } from '../../shared/interfaces';

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

  @NullableColumn({ unique: true })
  telegramUserId: number;

  @NullableColumn()
  role: UserRole;
}
