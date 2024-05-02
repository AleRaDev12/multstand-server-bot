import {
  WizardContext,
  WizardContextWizard,
  WizardSessionData,
} from 'telegraf/typings/scenes';
import { Order } from '../entities/order/order.entity';
import { Client } from '../entities/clients/client.entity';
import { StandProd } from '../entities/stand-prod/stand-prod.entity';
import { PartIn } from '../entities/part-in/part-in.entity';
import { Work } from '../entities/works/work.entity';
import { Task } from '../entities/tasks/task.entity';
import { FinancialTransaction } from '../entities/financial-transactions/financial-transaction.entity';
import { Master } from '../entities/masters/master.entity';
import { Component } from '../entities/component/component.entity';
import { StandOrder } from '../entities/stand-order/stand-order.entity';
import { WizardStepType } from '../helpers';
import { PartOut } from '../entities/part-out/part-out.entity';

// export type

export type AllEntities = {
  order?: Order;
  user?: Client;
  standProd?: StandProd;
  partIn?: PartIn;
  partOut?: PartOut;
  work?: Work;
  task?: Task;
  financialTransaction?: FinancialTransaction;
  master?: Master;
  component?: Component;
  standOrder?: StandOrder;
};

interface CustomWizardSessionData extends WizardSessionData, AllEntities {
  steps?: WizardStepType[];
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
