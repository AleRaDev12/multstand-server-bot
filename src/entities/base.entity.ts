export abstract class BaseEntity {
  public static entityName: string;
  public static nullable: { [key: string]: boolean };
}

export type EntityFieldsMap<T, P> = {
  [K in keyof T]?: P;
};
