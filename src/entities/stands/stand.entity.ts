import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { fromEnumValue, toEnumKey } from '../../helpers';

export enum StandModel {
  mTM15 = 'T-M-15',
  mTL15 = 'T-L-15',
  m2DMLite = '2D-M-Lite',
  mTMLite = 'T-Lite',
  m3DM5 = '3D-M-5',
}

export enum PaintingType {
  without = 'Без обработки',
  onlySanding = 'Только шлифовка',
  varnish = 'Шлифовка, лак',
  whiteVarnish = 'Шлифовка, белая эмаль, лак',
  blackVarnish = 'Шлифовка, чёрная эмаль, лак',
}

export enum LedStripType {
  seastar12v1 = 'Seastar 12v -lm 12W -CRI',
  seastar24v1 = 'Seastar 24v -lm 12W -CRI',
  arlight24v19913 = 'Arlight 19913 24v 1250lm 10W 85CRI',
  arlight24v24534 = 'Arlight 24534 24v 1800lm 12W 85CRI',
  arlight24v21451 = 'Arlight 21451 24v 1000lm 10W 98CRI',
}

@Entity()
export class Stand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    transformer: {
      to: toEnumKey(StandModel),
      from: fromEnumValue(StandModel),
    },
  })
  model: StandModel;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(PaintingType),
      from: fromEnumValue(PaintingType),
    },
  })
  painting: PaintingType; // Обработка, покраска

  @Column({ type: 'int', nullable: true })
  glassesRegular: number; // Стёкла обычные

  @Column({ type: 'int', nullable: true })
  glassesHighTransparency: number; // Стёкла повышенной прозрачности

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(LedStripType),
      from: fromEnumValue(LedStripType),
    },
  })
  ledStripModel: LedStripType; // Светодиодная лента

  @Column({ type: 'int', nullable: true })
  shadingFabric: number; // Ткань для затенения, 0 если нет

  @Column({ type: 'int', nullable: true })
  tripod: number; // Штатив для объёмной анимации, 0 если нет
}
