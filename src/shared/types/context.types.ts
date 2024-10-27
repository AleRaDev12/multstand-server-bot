import { Scenes } from 'telegraf';
import { WizardContext, WizardContextWizard } from 'telegraf/typings/scenes';
import { CustomWizardSessionData, BaseSession } from './session.types';
import { UserRole } from './common.types';

interface CustomWizardContextWizard<
  D extends CustomWizardSessionData = CustomWizardSessionData,
  E = object,
> extends WizardContextWizard<WizardContext<D & E>> {
  state: D & E;
}

// Контекст для обычных сцен
export interface CustomSceneContext
  extends Omit<Scenes.SceneContext, 'session'> {
  session: BaseSession;
  notRegistered?: boolean;
}

type WizardSessionOverrides = {
  session: BaseSession & CustomWizardSessionData;
};

// Контекст для визардов
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
  userRole: UserRole;
}
