import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { BaseEntity } from '../../entities/base.entity';

export interface UnifiedWizardHandlerOptions<
  T extends BaseEntity | Record<string, any>,
  E = object,
> {
  getEntity: (ctx: CustomWizardContext<any, E>) => T;
  setEntity: (ctx: CustomWizardContext<any, E>) => void;
  save: (
    this: any,
    entity: T,
    ctx?: CustomWizardContext<any, E>,
  ) => Promise<T | undefined | void>;
  print: (ctx: CustomWizardContext<any, E>, entity: T) => Promise<void>;
  initialSteps: WizardStepType[];
  handleSpecificAnswer?: (
    ctx: CustomWizardContext<any, E>,
    stepAnswer: WizardStepType,
    entity: T,
  ) => Promise<boolean>;
  handleSpecificRequest?: (
    ctx: CustomWizardContext<any, E>,
    stepRequest: WizardStepType,
  ) => Promise<boolean>;
}
