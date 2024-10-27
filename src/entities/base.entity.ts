import { UserRole } from '../shared/types';

export abstract class BaseEntity {
  public static entityName: string;
  public static nullable: { [key: string]: boolean };

  abstract format(userRole: UserRole, labelType?: LabelType): string;
}

export type EntityFieldsMap<T, P> = {
  [K in keyof T]?: P;
};

export type LabelType = 'full' | 'short' | 'line';

type RoleLabels<T, P> = {
  full: EntityFieldsMap<T, P>;
  short: EntityFieldsMap<T, P>;
  line?: EntityFieldsMap<T, P>;
};

export type EntityLabels<T, P> = {
  [key in Extract<UserRole, 'manager' | 'master'>]: RoleLabels<T, P>;
};
