import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { ComponentService } from './component.service';
import { ComponentAddWizard } from './component-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Component])],
  providers: [ComponentService, ComponentAddWizard],
  exports: [ComponentService],
})
export class ComponentModule {}
