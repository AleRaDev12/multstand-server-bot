import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { BaseEntity } from '../../entities/base.entity';

export interface UnifiedWizardHandlerOptions<T extends BaseEntity> {
  getEntity: (ctx: CustomWizardContext) => T;
  setEntity: (ctx: CustomWizardContext) => void;
  save: (
    this: any,
    entity: T,
    ctx?: CustomWizardContext,
  ) => Promise<T | undefined | void>;
  print: (ctx: CustomWizardContext, entity: T) => Promise<void>;
  initialSteps: WizardStepType[];
  handleSpecificAnswer?: (
    ctx: CustomWizardContext,
    stepAnswer: WizardStepType,
    entity: T,
  ) => Promise<boolean>;
  handleSpecificRequest?: (
    ctx: CustomWizardContext,
    stepRequest: WizardStepType,
  ) => Promise<boolean>;
}
