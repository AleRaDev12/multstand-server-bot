import { Column } from 'typeorm';
import 'reflect-metadata';

export function NullableColumn(additionalOptions: any = {}) {
  return function (target: any, propertyKey: string) {
    const entityName = target.constructor.entityName;
    const nullable = target.constructor.nullable[propertyKey];

    if (nullable === undefined) {
      throw new Error(
        `Nullable status for property ${propertyKey} not found in entity ${entityName}`,
      );
    }

    const options = { nullable, ...additionalOptions };
    Column(options)(target, propertyKey);
  };
}
