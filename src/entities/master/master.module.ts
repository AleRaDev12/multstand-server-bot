import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterService } from './master.service';
import { Master } from './master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Master])],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
