import { SetMetadata } from '@nestjs/common';

export const SceneRoles = (...roles: string[]) =>
  SetMetadata('sceneRoles', roles);
