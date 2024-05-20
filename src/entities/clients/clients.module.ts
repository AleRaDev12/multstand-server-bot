import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { ClientAddWizard } from './client-add.wizard';
import { ClientUpdateWizard } from './client-update.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService, ClientAddWizard, ClientUpdateWizard],
  exports: [ClientService],
})
export class ClientsModule {}
