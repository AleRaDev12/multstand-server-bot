import {
  WizardContext,
  WizardContextWizard,
  WizardSessionData,
} from 'telegraf/typings/scenes';
import { Order } from '../entities/orders/order/order.entity';
import { Client } from '../entities/client/client.entity';
import { StandProd } from '../entities/parts/stand-prod/stand-prod.entity';
import { PartIn } from '../entities/parts/part-in/part-in.entity';
import { PartOut } from '../entities/parts/part-out/part-out.entity';
import { Work } from '../entities/works/work/work.entity';
import { Task } from '../entities/works/tasks/task.entity';
import { User } from '../entities/user/user.entity';
import { Component } from '../entities/parts/component/component.entity';
import { StandOrder } from '../entities/orders/stand-order/stand-order.entity';
import { Account } from '../entities/money/account/account.entity';
import { Scenes } from 'telegraf';
import { Transaction } from '../entities/money/transaction/transaction.entity';
import { LabelsType } from '../entities/base.entity';

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
      linkedEntity?: keyof AllEntities;
      type: 'string' | 'number' | 'date' | 'boolean';
      union?: undefined;
    }
  | {
      field?: KeyOfAllEntities;
      linkedEntity?: keyof AllEntities;
      type: 'union';
      union: object;
    }
  | {
      field?: KeyOfAllEntities;
      linkedEntity?: keyof AllEntities;
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
  temp?: object;
};

interface CustomWizardSessionData extends WizardSessionData, AllEntities {
  steps?: WizardStepType[];
  tempData?: object;
  selectedDate?: Date;
  userRole?: UserRole;
}

interface CustomWizardContextWizard<
  D extends CustomWizardSessionData = CustomWizardSessionData,
> extends WizardContextWizard<WizardContext<D>> {
  state: D;
}

export interface SceneAuthContext extends Scenes.SceneContext {
  userRole: UserRole;
}

export interface CustomWizardContext<
  D extends CustomWizardSessionData = CustomWizardSessionData,
> extends BaseWizardContext<D> {}

type ExtendedSceneSession<
  D extends CustomWizardSessionData = CustomWizardSessionData,
> = Scenes.SceneSession<D> & { userRole?: UserRole };

interface BaseWizardContext<
  D extends CustomWizardSessionData = CustomWizardSessionData,
> extends Scenes.SceneContext {
  session: ExtendedSceneSession<D>;
  scene: Scenes.SceneContextScene<BaseWizardContext<D>, D>;
  wizard: CustomWizardContextWizard<D>;
  userRole: UserRole;
}

export type MessageType = {
  text: string;
};

export interface CustomContext extends Scenes.SceneContext {
  notRegistered?: boolean;
}

export type UserRole = 'manager' | 'master' | 'unregistered' | 'unknown';

export type FormatFunction = (
  userRole: UserRole,
  labelType: LabelsType,
) => string;
