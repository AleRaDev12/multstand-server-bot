import {
  WizardContext,
  WizardContextWizard,
  WizardSessionData,
} from 'telegraf/typings/scenes';
import { Order } from '../entities/orders/order/order.entity';
import { Client } from '../entities/client/client.entity';
import { PartIn } from '../entities/component/part-in/part-in.entity';
import { Work } from '../entities/work/work.entity';
import { Task } from '../entities/tasks/task.entity';
import { Money } from '../entities/money/money.entity';
import { User } from '../entities/user/user.entity';
import { Component } from '../entities/component/component/component.entity';
import { PartOut } from '../entities/component/part-out/part-out.entity';
import { StandOrder } from '../entities/orders/stand-order/stand-order.entity';
import { StandProd } from '../entities/component/stand-prod/stand-prod.entity';

export type KeyOfAllEntities = {
  [K in keyof AllEntities]: AllEntities[K] extends undefined
    ? never
    : keyof AllEntities[K];
}[keyof AllEntities];

export type DbEntities =
  | 'taskSelect'
  | 'orderSelect'
  | 'clientSelect'
  | 'componentSelect'
  | 'standOrderSelect'
  | 'standProdSelect'
  | 'orderModelSelect';

export type WizardStepType = {
  message: string;
} & (
  | {
      field?: KeyOfAllEntities;
      type: 'string' | 'number' | 'date' | 'boolean';
      union?: undefined;
    }
  | {
      field?: KeyOfAllEntities;
      type: 'union';
      union: object;
    }
  | {
      field?: KeyOfAllEntities;
      type: DbEntities;
      union?: undefined;
    }
);

export type WizardStepTypeN<T> = {
  message: string;
} & (
  | {
      field?: keyof T;
      type: 'string' | 'number' | 'date' | 'boolean';
      union?: undefined;
    }
  | {
      field?: keyof T;
      type: 'union';
      union: object;
    }
  | {
      field?: undefined;
      type: DbEntities;
      union?: undefined;
    }
);

export type AllEntities = {
  order?: Order;
  client?: Client;
  standProd?: StandProd;
  partIn?: PartIn;
  partOut?: PartOut;
  work?: Work;
  task?: Task;
  money?: Money;
  master?: User;
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
