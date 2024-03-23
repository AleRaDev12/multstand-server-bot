import {
  WizardContext,
  WizardContextWizard,
  WizardSessionData,
} from 'telegraf/typings/scenes';
import { Order } from '../entities/orders/order.entity';
import { Client } from '../entities/clients/client.entity';
import { Stand } from '../entities/stands/stand.entity';
import { Context, Update } from 'nestjs-telegraf';

interface CustomWizardSessionData extends WizardSessionData {
  order?: Order;
  user?: Client;
  stand?: Stand;
}

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
