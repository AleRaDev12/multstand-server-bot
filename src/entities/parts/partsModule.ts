import { Module } from '@nestjs/common';
import { PartInModule } from './part-in/part-in.module';
import { PartOutModule } from './part-out/part-out.module';
import { StandProdModule } from './stand-prod/stand-prod.module';
import { PartsScene } from './partsScene';
import { PartsRemainingListScene } from './parts-remaining-list.scene';
import { ComponentModule } from './component/component.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartIn } from './part-in/part-in.entity';
import { PartOut } from './part-out/part-out.entity';
import { PartsService } from './parts.service';
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
  providers: [PartsScene, PartsRemainingListScene, PartsService],
  exports: [],
})
export class PartsModule {}
