import { Scenes } from 'telegraf';
import { WizardContext, WizardContextWizard } from 'telegraf/typings/scenes';
import { BaseSession } from '../../shared/types';
import { WizardStep } from './types';

export type WizardData<T> = {
  values: T;
  meta: {
    steps: WizardStep<T>[];
  };
};

interface StepWizardState<T> {
  data: WizardData<T>;
}

interface StepWizardContextWizard<T>
  extends WizardContextWizard<WizardContext> {
  state: StepWizardState<T>;
}

export interface StepWizardContext<T> extends Scenes.SceneContext {
  scene: Scenes.SceneContextScene<StepWizardContext<T>>;
  wizard: StepWizardContextWizard<T>;
  session: BaseSession;
}
