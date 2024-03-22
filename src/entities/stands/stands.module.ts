import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stand } from './stand.entity';
import { StandAddWizard } from './standAdd.wizard';
import { StandsService } from './stands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stand])],
  providers: [StandsService, StandAddWizard],
  exports: [StandsService],
})
export class StandsModule {}
