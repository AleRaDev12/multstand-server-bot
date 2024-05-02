import { AllEntities } from './shared/interfaces';

export function printUnion<T>(e: T): string {
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

export function getValueByIndex<T>(
  enumObj: T,
  index: number,
): T[keyof T] | undefined {
  const keys = Object.keys(enumObj) as (keyof T)[];
  return enumObj[keys[index]];
}

export function getValueUnionByIndex<T>(
  obj: T,
  index: number,
): T[keyof T] | undefined {
  const values = Object.values(obj) as T[keyof T][];
  return values[index];
}

export function toEnumKey<T extends Record<string, any>>(enumType: T) {
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

export function fromEnumValue<T extends Record<string, any>>(enumType: T) {
  return (key: string): T[keyof T] => {
    const value = enumType[key as keyof T];
    if (typeof value !== 'undefined') {
      return value;
    }
    throw new Error(`Enum value for key "${key}" not found`);
  };
}

// Функция для преобразования значения enum в ключ
export function toKey<T>(obj: T) {
  return (value: T[keyof T]): string | undefined => {
    return Object.keys(obj).find((key) => obj[key as keyof T] === value);
  };
}

// Функция для преобразования ключа в значение enum
export function fromValue<T>(obj: T) {
  return (key: string): T[keyof T] | undefined => {
    return obj[key as keyof T];
  };
}

// Создание типа, который объединяет ключи всех объектов в AllEntities
type KeyOfAllEntities = {
  [K in keyof AllEntities]: AllEntities[K] extends undefined
    ? never
    : keyof AllEntities[K];
}[keyof AllEntities];

export type WizardStepType = {
  message: string;
  field?: KeyOfAllEntities;
} & (
  | {
      type:
        | 'string'
        | 'number'
        | 'date'
        | 'boolean'
        | 'taskSelect'
        | 'orderSelect'
        | 'clientSelect';
      union?: undefined;
    }
  | {
      type: 'union';
      union: object;
    }
);

export function generateMessage(step: WizardStepType): string {
  return step.union
    ? `${step.message}\n${printUnion(step.union)}`
    : step.message;
}
