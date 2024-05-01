import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { fromEnumValue, fromValue, toEnumKey, toKey } from '../../helpers';
import {
  LedStripModel,
  LedStripModelType,
  Painting,
  PaintingType,
  StandModel,
  StandModelType,
  Tripod,
  TripodType,
} from '../unions';

@Entity()
export class StandProd {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    transformer: {
      to: toKey(StandModel),
      from: fromValue(StandModel),
    },
  })
  model: StandModelType;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(Painting),
      from: fromEnumValue(Painting),
    },
  })
  painting: PaintingType;

  @Column({ type: 'int', nullable: true })
  glassesRegular: number; // Стёкла обычные

  @Column({ type: 'int', nullable: true })
  glassesHighTransparency: number; // Стёкла повышенной прозрачности

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(LedStripModel),
      from: fromEnumValue(LedStripModel),
    },
  })
  ledStripModel: LedStripModelType;

  @Column({ type: 'int', nullable: true })
  shadingFabric: number; // Ткань для затенения, 0 если нет

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toKey(Tripod),
      from: fromValue(Tripod),
    },
  })
  tripod: TripodType;
}
