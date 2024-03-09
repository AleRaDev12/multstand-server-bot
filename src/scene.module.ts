import { Module } from '@nestjs/common';
import { AddUserScene } from './shared/scenes/add-user.scene';
import { AddOrderScene } from './shared/scenes/add-order.scene';

@Module({
  providers: [AddUserScene, AddOrderScene],
})
export class ScenesModule {}
