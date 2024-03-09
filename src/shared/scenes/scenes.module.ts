import { Module } from '@nestjs/common';
import { AddUserScene } from './add-user.scene';
import { AddOrderScene } from './add-order.scene';
import { AddUserWizard } from '../wizards/add-user.wizard';
import { AddOrderWizard } from '../wizards/add-order.wizard';

@Module({
  providers: [AddUserScene, AddOrderScene, AddUserWizard, AddOrderWizard],
})
export class ScenesModule {}
