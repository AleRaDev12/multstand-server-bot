import { Scenes } from 'telegraf';
import { WizardContext, WizardContextWizard } from 'telegraf/typings/scenes';
import { BaseSession } from '../../shared/types';
import { WizardStep } from './types';

export type WizardData<T, W> = {
  values: T;
  meta: {
    steps: WizardStep<T, W>[];
  };
};

interface StepWizardState<T, W> {
  data: WizardData<T, W>;
}

interface StepWizardContextWizard<T, W>
  extends WizardContextWizard<WizardContext> {
  state: StepWizardState<T, W>;
}

export interface StepWizardContext<T, W> extends Scenes.SceneContext {
  scene: Scenes.SceneContextScene<StepWizardContext<T, W>>;
  wizard: StepWizardContextWizard<T, W>;
  session: BaseSession;
}
