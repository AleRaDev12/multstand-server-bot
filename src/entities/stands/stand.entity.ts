import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

export function printEnum<T>(e: T): string {
  const keys = Object.keys(e).filter((key) => isNaN(Number(key)));
  const enumEntries = keys.map((key, index) => {
    const value = (e as any)[key];
    return `${index + 1}. ${value}`;
  });
  return enumEntries.join('\n');
}

export function getKeyByIndex(enumObj: any, index: number): string | undefined {
  const keys = Object.keys(enumObj).filter((k) => isNaN(Number(k)));
  return keys[index];
}

export function getKeyByValue(value: string): string | undefined {
  return Object.keys(StandModel).find(
    (key) => StandModel[key as keyof typeof StandModel] === value,
  );
}

export function getValueByIndex<T>(
  enumObj: T,
  index: number,
): T[keyof T] | undefined {
  const keys = Object.keys(enumObj) as (keyof T)[];
  return enumObj[keys[index]];
}

function toEnumKey<T extends Record<string, any>>(enumType: T) {
  return (value: T[keyof T]): string => {
    const entry = Object.entries(enumType).find(
      ([, enumValue]) => enumValue === value,
    );
    if (entry) {
      return entry[0];
    }
    throw new Error(`Enum key for value "${value}" not found`);
  };
}

function fromEnumValue<T extends Record<string, any>>(enumType: T) {
  return (key: string): T[keyof T] => {
    const value = enumType[key as keyof T];
    if (typeof value !== 'undefined') {
      return value;
    }
    throw new Error(`Enum value for key "${key}" not found`);
  };
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

  // @Column({
  //   type: 'text',
  //   transformer: {
  //     to: toEnumKey(PaintingType),
  //     from: fromEnumValue(PaintingType),
  //   },
  // })
  // painting: PaintingType; // Обработка, покраска

  //
  // @Column('int')
  // glassesRegular: number; // Стёкла обычные
  //
  // @Column('int')
  // glassesHighTransparency: number; // Стёкла повышенной прозрачности
  //
  // @Column({ length: 255 })
  // ledStrip: string; // Светодиодная лента
  //
  // @Column('int')
  // shadingFabric: number; // Ткань для затенения, 0 если нет
  //
  // @Column('int')
  // volumeAnimationTripod: number; // Штатив для объёмной анимации, 0 если нет

  // Glasses
}
