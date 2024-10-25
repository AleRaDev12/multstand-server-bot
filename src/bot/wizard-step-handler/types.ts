import { CustomWizardContext, WizardStepType } from '../../shared/interfaces';
import { BaseEntity } from '../../entities/base.entity';

// types.ts

// Сохраняем обратную совместимость для существующих визардов
export interface UnifiedWizardHandlerOptions<T extends BaseEntity, E = object> {
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

// Базовый интерфейс для всех опций визарда
export interface BaseWizardHandlerOptions<TState = void> {
  save: (state: TState, ctx?: CustomWizardContext) => Promise<TState | void>;
  print: (ctx: CustomWizardContext, state: TState) => Promise<void>;
  initialSteps: WizardStepType[];
  handleSpecificAnswer?: (
    ctx: CustomWizardContext,
    stepAnswer: WizardStepType,
    state: TState,
  ) => Promise<boolean>;
  handleSpecificRequest?: (
    ctx: CustomWizardContext,
    stepRequest: WizardStepType,
  ) => Promise<boolean>;
}

// Опции для визардов, работающих с сущностями
export interface EntityWizardHandlerOptions<T extends BaseEntity>
  extends BaseWizardHandlerOptions<T> {
  getEntity: (ctx: CustomWizardContext) => T;
  setEntity: (ctx: CustomWizardContext) => void;
}

// Опции для визардов с кастомным состоянием
export interface CustomWizardHandlerOptions<TState>
  extends BaseWizardHandlerOptions<TState> {
  initState: () => TState;
}
