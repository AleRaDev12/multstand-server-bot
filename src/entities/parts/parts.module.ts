import { forwardRef, Module } from '@nestjs/common';
import { PartInModule } from './part-in/part-in.module';
import { PartOutModule } from './part-out/part-out.module';
import { StandProdModule } from './stand-prod/stand-prod.module';
import { PartsRemainingListScene } from './parts-remaining-list.scene';
import { ComponentModule } from './component/component.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartIn } from './part-in/part-in.entity';
import { PartOut } from './part-out/part-out.entity';
import { PartsService } from './parts.service';
import { Component } from './component/component.entity';
import { PartsScene } from './parts.scene';
import { TaskComponentLinkWizard } from './task-component-link.wizard';
import { TaskModule } from '../works/tasks/task.module';

@Module({
  imports: [
    ComponentModule,
    PartInModule,
    forwardRef(() => PartOutModule), // TODO: *-* remake this after to use without forwardRefer
    TaskModule,
    StandProdModule,
    TypeOrmModule.forFeature([Component, PartIn, PartOut]),
  ],
  providers: [
    PartsScene,
    PartsRemainingListScene,
    PartsService,
    TaskComponentLinkWizard,
  ],
  exports: [PartsService],
})
export class PartsModule {}
