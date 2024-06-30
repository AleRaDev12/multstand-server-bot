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
import { User } from '../entities/user/user.entity';
import { Component } from '../entities/component/component/component.entity';
import { PartOut } from '../entities/component/part-out/part-out.entity';
import { StandOrder } from '../entities/orders/stand-order/stand-order.entity';
import { StandProd } from '../entities/component/stand-prod/stand-prod.entity';
import { Transaction } from '../entities/money/transaction/transaction.entity';
import { Scenes } from 'telegraf';
import { Account } from '../entities/money/account/account.entity';

export type KeyOfAllEntities = {
  [K in keyof AllEntities]: AllEntities[K] extends undefined
    ? never
    : keyof AllEntities[K];
}[keyof AllEntities];

export type AdditionalWizardSelections =
  | 'taskSelect'
  | 'orderSelect'
  | 'clientSelect'
  | 'componentSelect'
  | 'standOrderSelect'
  | 'standProdSelect'
  | 'orderModelSelect'
  | 'partsInBatchSelect'
  | 'masterSelect'
  | 'accountSelect';

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
      type: AdditionalWizardSelections;
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
      type: AdditionalWizardSelections;
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
  transaction?: Transaction;
  master?: User;
  component?: Component;
  standOrder?: StandOrder;
  account?: Account;
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

export interface CustomContext extends Scenes.SceneContext {
  notRegistered?: boolean;
}

export type UserRole = 'manager' | 'master' | 'unregistered' | 'unknown';
