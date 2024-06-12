import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { ComponentService } from './component.service';
import { ComponentAddWizard } from './component-add.wizard';
import { ComponentListScene } from './component-list.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Component])],
  providers: [ComponentService, ComponentAddWizard, ComponentListScene],
  exports: [ComponentService],
})
export class ComponentModule {}
