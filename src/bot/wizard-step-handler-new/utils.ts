import {
  PathsToStringPropsWithDepth,
  PathValue,
  WIZARD_STEP_VALUE_TYPE,
} from './types';

export function setValueByPath<T>(
  obj: T,
  path: PathsToStringPropsWithDepth<T>,
  value: PathValue<T, PathsToStringPropsWithDepth<T>>,
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

export type ValidResult = {
  isValid: true;
  value: any;
};

export type InvalidResult = {
  isValid: false;
  error: string;
};

export type ValidationResult = ValidResult | InvalidResult;

const BOOL_MAP: Record<string, boolean> = {
  true: true,
  yes: true,
  '1': true,
  да: true,
  false: false,
  no: false,
  '0': false,
  нет: false,
};

export function parseDate(value: string): Date | null {
  const now = new Date();

  // Handle short date format (day only)
  if (/^\d{1,2}$/.test(value)) {
    const day = parseInt(value);
    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    if (day > 0 && day <= lastDayOfMonth) {
      return new Date(now.getFullYear(), now.getMonth(), day);
    }
    return null;
  }

  // Handle DD.MM.YYYY format
  const ddmmyyyyMatch = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [_, day, month, year] = ddmmyyyyMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isValidDate(date)) {
      return date;
    }
    return null;
  }

  // Handle YYYY-MM-DD format
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const date = new Date(value);
    if (isValidDate(date)) {
      return date;
    }
    return null;
  }

  return null;
}

function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function parseValue(
  value: string,
  type: WIZARD_STEP_VALUE_TYPE,
): ValidationResult {
  switch (type) {
    case 'number': {
      const num = parseFloat(value.replace(',', '.'));
      if (isNaN(num)) {
        return {
          isValid: false,
          error: 'Invalid number format',
        };
      }
      return {
        isValid: true,
        value: num,
      };
    }

    case 'boolean': {
      const boolValue = BOOL_MAP[value.toLowerCase()];
      if (boolValue === undefined) {
        return {
          isValid: false,
          error: 'Invalid boolean format',
        };
      }
      return {
        isValid: true,
        value: boolValue,
      };
    }

    case 'date':
      const date = parseDate(value);
      if (!date)
        return {
          isValid: false,
          error: 'Invalid date format',
        };
      return {
        isValid: true,
        value: date,
      };

    default:
      return {
        isValid: false,
        error: 'Unknown type',
      };
  }
}
