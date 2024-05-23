import { DataSource, EntityTarget } from 'typeorm';

export async function isColumnNullable<T>(
  dataSource: DataSource,
  entityClass: EntityTarget<T>,
  columnName: string,
): Promise<boolean> {
  const repository = dataSource.getRepository(entityClass);
  const metadata = repository.metadata;
  const column = metadata.findColumnWithPropertyName(columnName);

  if (column) {
    return column.isNullable;
  }

  throw new Error(`Column ${columnName} not found in entity ${metadata.name}`);
}
