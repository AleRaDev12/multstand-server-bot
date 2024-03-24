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

export function getValueByIndex<T>(
  enumObj: T,
  index: number,
): T[keyof T] | undefined {
  const keys = Object.keys(enumObj) as (keyof T)[];
  return enumObj[keys[index]];
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
