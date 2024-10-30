import { PathsToStringProps, PathValue, WIZARD_STEP_VALUE_TYPE } from './types';

export function setValueByPath<T>(
  obj: T,
  path: PathsToStringProps<T>,
  value: PathValue<T, PathsToStringProps<T>>,
): void {
  const parts = path.split('.');
  let current: any = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i] as keyof typeof current;
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1] as keyof typeof current;
  current[lastPart] = value;
}

export function parseValue(value: string, type: WIZARD_STEP_VALUE_TYPE): any {
  switch (type) {
    case 'number':
      const num = parseFloat(value.replace(',', '.'));
      if (isNaN(num)) throw new Error('Invalid number format');
      return num;
    case 'boolean':
      const boolMap: Record<string, boolean> = {
        true: true,
        yes: true,
        '1': true,
        да: true,
        false: false,
        no: false,
        '0': false,
        нет: false,
      };
      const boolValue = boolMap[value.toLowerCase()];
      if (boolValue === undefined) throw new Error('Invalid boolean format');
      return boolValue;
    case 'date':
      const date = new Date(value);
      if (isNaN(date.getTime())) throw new Error('Invalid date format');
      return date;
    default:
      return value;
  }
}
