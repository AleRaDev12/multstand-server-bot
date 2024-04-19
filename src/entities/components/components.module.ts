import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { ComponentsService } from './components.service';
import { ComponentsAddWizard } from './components-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Component])],
  providers: [ComponentsService, ComponentsAddWizard],
  exports: [ComponentsService],
})
export class ComponentsModule {}
