import { Scenes } from 'telegraf';
import { WizardContext, WizardContextWizard } from 'telegraf/typings/scenes';
import { BaseSession, CustomWizardSessionData } from './session.types';

interface CustomWizardContextWizard<
  D extends CustomWizardSessionData = CustomWizardSessionData,
  E = object,
> extends WizardContextWizard<WizardContext<D & E>> {
  state: D & E;
}

export interface CustomSceneContext
  extends Omit<Scenes.SceneContext, 'session'> {
  session: BaseSession;
  notRegistered?: boolean;
}

type WizardSessionOverrides = {
  session: BaseSession & CustomWizardSessionData;
};

export interface CustomWizardContext<
  D extends CustomWizardSessionData = CustomWizardSessionData,
  E = object,
> extends Omit<Scenes.SceneContext, 'session'>,
    WizardSessionOverrides {
  scene: Scenes.SceneContextScene<
    CustomWizardContext<D, E>,
    Scenes.SceneSessionData
  >;
  wizard: CustomWizardContextWizard<D, E>;
}
