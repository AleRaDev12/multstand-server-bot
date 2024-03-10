import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';
import { ClientAddWizard } from './clientAdd.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientsService, ClientAddWizard],
  exports: [ClientsService],
})
export class ClientsModule {}
