import { Order } from '../../entities/orders/order/order.entity';
import { Client } from '../../entities/client/client.entity';
import { StandProd } from '../../entities/parts/stand-prod/stand-prod.entity';
import { PartIn } from '../../entities/parts/part-in/part-in.entity';
import { PartOut } from '../../entities/parts/part-out/part-out.entity';
import { Work } from '../../entities/works/work/work.entity';
import { User } from '../../entities/user/user.entity';
import { Component } from '../../entities/parts/component/component.entity';
import { StandOrder } from '../../entities/orders/stand-order/stand-order.entity';
import { Account } from '../../entities/money/account/account.entity';
import { Transaction } from '../../entities/money/transaction/transaction.entity';
import { Task } from '../../entities/works/task/task.entity';

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

export type KeyOfAllEntities = {
  [K in keyof AllEntities]: AllEntities[K] extends undefined
    ? never
    : keyof AllEntities[K];
}[keyof AllEntities];
