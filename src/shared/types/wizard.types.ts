import { AdditionalWizardSelections } from './common.types';
import { KeyOfAllEntities, AllEntities } from './entities.types';

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
