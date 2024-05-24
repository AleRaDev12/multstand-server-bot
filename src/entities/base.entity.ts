export abstract class BaseEntity {
  public static entityName: string;
  public static nullable: { [key: string]: boolean };
}
