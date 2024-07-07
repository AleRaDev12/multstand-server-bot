import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SceneContext } from 'telegraf/scenes';
import { ExtendedSceneSessionData } from '../guards/scene-role.guard';
import { SceneAuthContext } from '../../shared/interfaces';

export const CtxAuth = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): SceneAuthContext => {
    const scenesContext = executionContext.getArgByIndex(0) as SceneContext & {
      session: ExtendedSceneSessionData;
    };
    const extendedContext = Object.create(
      Object.getPrototypeOf(scenesContext),
      Object.getOwnPropertyDescriptors(scenesContext),
    );

    extendedContext.userRole = scenesContext.session.userRole;

    return extendedContext as SceneAuthContext;
  },
);
