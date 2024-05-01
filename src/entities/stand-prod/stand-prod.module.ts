import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandProd } from './stand-prod.entity';
import { StandProdAddWizard } from './stand-prod-add.wizard';
import { StandProdService } from './stand-prod.service';

@Module({
  imports: [TypeOrmModule.forFeature([StandProd])],
  providers: [StandProdService, StandProdAddWizard],
  exports: [StandProdService],
})
export class StandProdModule {}
