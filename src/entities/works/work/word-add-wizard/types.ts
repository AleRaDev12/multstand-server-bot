import { WorkAddWizard } from './work-add.wizard';
import { StepWizardContext } from '../../../../bot/wizard-step-handler-new/wizard-context-types';
import { Master } from '../../../master/master.entity';
import { Task } from '../../task/task.entity';
import { StandProd } from '../../../parts/stand-prod/stand-prod.entity';
import { Component } from '../../../parts/component/component.entity';

export type CurrentData = {
  master: Master;
  task: Task;
  savedCost: number;
  paymentCoefficient: number;
  standProd: StandProd;
  workCount: number;
  component: Component;
  partOutCount: number;
  date: Date;
  description: string;
  isWithComponents: boolean;
};

export type CurrentWizard = WorkAddWizard;
export type CurrentWizardContext = StepWizardContext<
  CurrentData,
  CurrentWizard
>;
