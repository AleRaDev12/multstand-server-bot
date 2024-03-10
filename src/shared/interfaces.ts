import {
  WizardContext,
  WizardContextWizard,
  WizardSessionData,
} from 'telegraf/typings/scenes';
import { Order } from '../entities/orders/order.entity';
import { Client } from '../entities/clients/client.entity';

interface CustomWizardSessionData extends WizardSessionData {
  order?: Order;
  user?: Client;
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
