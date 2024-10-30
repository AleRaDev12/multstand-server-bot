import { Scenes } from 'telegraf';
import { WizardSessionData } from 'telegraf/typings/scenes';
import { AllEntities } from './entities.types';
import { WizardStepType } from './wizard.types';
import { UserRole } from './common.types';

export interface BaseSession extends Scenes.SceneSession {
  userRole?: UserRole;
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
