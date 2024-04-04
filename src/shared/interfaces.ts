import {
  WizardContext,
  WizardContextWizard,
  WizardSessionData,
} from 'telegraf/typings/scenes';
import { Order } from '../entities/orders/order.entity';
import { Client } from '../entities/clients/client.entity';
import { Stand } from '../entities/stands/stand.entity';
import { PartIn } from '../entities/partsIn/partIn.entity';
import { Work } from '../entities/works/work.entity';

// export type

export type AllEntities = {
  order?: Order;
  user?: Client;
  stand?: Stand;
  partIn?: PartIn;
  work?: Work;
};

interface CustomWizardSessionData extends WizardSessionData, AllEntities {}

interface CustomWizardContextWizard<
  D extends CustomWizardSessionData = CustomWizardSessionData,
> extends WizardContextWizard<WizardContext<D>> {
  state: D;
}

export interface CustomWizardContext<
  D extends CustomWizardSessionData = CustomWizardSessionData,
> extends WizardContext<D> {
  wizard: CustomWizardContextWizard<D>;
}

export type MessageType = {
  text: string;
};
