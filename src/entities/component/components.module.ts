import { Module } from '@nestjs/common';
import { PartInModule } from './part-in/part-in.module';
import { PartOutModule } from './part-out/part-out.module';
import { StandProdModule } from './stand-prod/stand-prod.module';
import { ComponentsScene } from './components.scene';
import { ComponentsRemainingListScene } from './parts-remaining-list.scene';
import { ComponentModule } from './component/component.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartIn } from './part-in/part-in.entity';
import { PartOut } from './part-out/part-out.entity';
import { ComponentsService } from './components.service';
import { Component } from './component/component.entity';

@Module({
  imports: [
    ComponentModule,
    PartInModule,
    PartOutModule,
    StandProdModule,
    TypeOrmModule.forFeature([Component]),
    TypeOrmModule.forFeature([PartIn]),
    TypeOrmModule.forFeature([PartOut]),
  ],
  providers: [ComponentsScene, ComponentsRemainingListScene, ComponentsService],
  exports: [],
})
export class ComponentsModule {}
