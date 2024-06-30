import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Scenes } from 'telegraf';

export interface SceneContextWithUserId extends Scenes.SceneContext {
  telegramUserId: number;
}

export const CtxWithUserId = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext): SceneContextWithUserId => {
    const scenesContext = executionContext.getArgByIndex(
      0,
    ) as Scenes.SceneContext;
    const userId = scenesContext.from?.id;

    if (!userId) {
      throw new Error('User id not found');
    }

    const extendedContext = Object.create(
      Object.getPrototypeOf(scenesContext),
      Object.getOwnPropertyDescriptors(scenesContext),
    );

    extendedContext.telegramUserId = userId;

    return extendedContext as SceneContextWithUserId;
  },
);
