import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { fromValue, toKey } from '../../helpers';

enum PartsStand {
  baseTM15 = 'TM15 каркас',
  frameTM15 = 'TM15 рамка под стекло',
  baseTL15 = 'TL15 каркас',
  frameTL15 = 'TL15 рамка под стекло',
  baseTMLite = 'TLite',
  base2DMLite = '2D-M-Lite',
  base3DM5 = '3DM5 каркас',
  wall3DM5 = '3DM5 стенка',
  round3DM5 = '3DM5 радиус',
  base3LM5 = '3DL5 каркас',
  wall3LM5 = '3DL5 стенка',
  round3LM5 = '3DL5 радиус',
}

enum PartsGlasses {
  glassesRegular = 'Стекло обычное',
  glassesHighTransparency = 'Стекло повышенной прозрачности',
}

export const Parts = {
  ...PartsStand,
  ...PartsGlasses,
};
type PartsType = (typeof Parts)[keyof typeof Parts];

@Entity()
export class PartIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    transformer: {
      to: toKey(Parts),
      from: fromValue(Parts),
    },
  })
  part: PartsType;

  @Column({
    type: 'date',
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  dateOrder: Date;

  @Column({
    type: 'date',
    nullable: true,
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  dateArrival: Date;

  @Column({
    type: 'int',
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  amount: number;

  @Column({
    type: 'int',
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  count: number;
}
