import { CustomWizardContext, WizardStepType } from './interfaces';
import { Scenes } from 'telegraf';
import { SCENES, WIZARDS } from './scenes-wizards';
import { format } from 'date-fns';
import { sendMessage } from './senMessages';

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

export function toKey<T>(obj: T) {
  return (value: T[keyof T]): string | undefined => {
    return Object.keys(obj).find((key) => obj[key as keyof T] === value);
  };
}

export function fromValue<T>(obj: T) {
  return (key: string): T[keyof T] | undefined => {
    return obj[key as keyof T];
  };
}

export function generateMessage(step: WizardStepType): string {
  return step.union
    ? `${step.message}\n${printUnion(step.union)}`
    : step.message;
}

export async function goToSceneOrWizard(
  ctx: Scenes.SceneContext,
  target: SCENES | WIZARDS,
) {
  try {
    await ctx.scene.enter(target);
  } catch (e) {
    await sendMessage(ctx, e.message);
  }
}

export async function handleButtonPress(
  ctx: Scenes.SceneContext,
  action: () => Promise<any>,
) {
  try {
    await action();
  } catch (e) {
    await sendMessage(ctx, e.message);
  } finally {
    await ctx.answerCbQuery();
  }
}

export const formatLabels = (
  entity: Record<string, any>,
  labels: Record<string, string>,
): string => {
  return Object.keys(labels)
    .filter(
      (key) =>
        entity[key] !== null &&
        entity[key] !== undefined &&
        entity[key] !== '' &&
        labels[key] !== undefined,
    )
    .map((key) => {
      const value = entity[key];
      let formattedValue: string | number | Date;

      if (value instanceof Date) {
        formattedValue = format(value, 'yyyy-MM-dd');
      } else if (typeof value === 'number' && !Number.isInteger(value)) {
        formattedValue = value.toFixed(2);
      } else {
        formattedValue = value;
      }

      return `${labels[key]}: ${formattedValue}`;
    })
    .join('\n');
};

export const getMessage = (ctx: CustomWizardContext | Scenes.SceneContext) => {
  // TODO: update types
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return ctx.update?.message as { text?: string };
};

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

export const formatWithListIndexes = (list: string[]): string[] => {
  return list.map((item, index) => `№${index + 1}. ${item}`);
};
