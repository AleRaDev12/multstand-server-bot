import { UserRole } from '../shared/interfaces';

export abstract class BaseEntity {
  public static entityName: string;
  public static nullable: { [key: string]: boolean };
}

export type EntityFieldsMap<T, P> = {
  [K in keyof T]?: P;
};

export type LabelsType = 'full' | 'short';

type RoleLabels<T, P> = {
  [key in LabelsType]: EntityFieldsMap<T, P>;
};

export type EntityLabels<T, P> = {
  [key in Extract<UserRole, 'manager' | 'master'>]: RoleLabels<T, P>;
};
