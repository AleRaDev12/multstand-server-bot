import { PartOut } from './part-out.entity';
import { PartOutService } from './part-out.service';
import { PartOutAddWizard } from './part-out-add.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { PartIn } from '../part-in/part-in.entity';
import { ComponentModule } from '../component/component.module';
import { PartOutListScene } from './part-out-list.scene';
import { PartsModule } from '../parts.module';
import { StandProdModule } from '../stand-prod/stand-prod.module';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartOut, PartIn]),
    ComponentModule,
    StandProdModule,
    forwardRef(() => PartsModule), // TODO: *-* remake this after to use without forwardRef
    UserModule,
  ],
  providers: [PartOutService, PartOutAddWizard, PartOutListScene],
  exports: [PartOutService],
})
export class PartOutModule {}
