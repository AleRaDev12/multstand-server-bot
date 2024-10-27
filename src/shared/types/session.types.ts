import { Scenes } from 'telegraf';
import { WizardSessionData } from 'telegraf/typings/scenes';
import { AllEntities } from './entities.types';
import { WizardStepType } from './wizard.types';
import { UserRole } from './common.types';

// Базовая сессия со всеми общими полями
export interface BaseSession extends Scenes.SceneSession {
  userRole?: UserRole;
  __scenes?: Scenes.SceneSession['__scenes'];
}

export interface CustomWizardSessionData
  extends WizardSessionData,
    AllEntities {
  steps?: WizardStepType[];
  tempData?: object;
  selectedDate?: Date;
  userRole?: UserRole;
  wizardState?: any;
}
