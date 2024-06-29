import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandProd } from './stand-prod.entity';
import { StandProdAddWizard } from './stand-prod-add.wizard';
import { StandProdService } from './stand-prod.service';
import { StandOrderModule } from '../../orders/stand-order/stand-order.module';
import { StandProdListScene } from './stand-prod-list.scene';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StandProd]),
    StandOrderModule,
    UserModule,
  ],
  providers: [StandProdService, StandProdAddWizard, StandProdListScene],
  exports: [StandProdService],
})
export class StandProdModule {}
