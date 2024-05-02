import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { ClientAddWizard } from './clientAdd.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService, ClientAddWizard],
  exports: [ClientService],
})
export class ClientsModule {}
