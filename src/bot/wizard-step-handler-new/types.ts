import { StepWizardContext } from './wizard-context-types';

export type WIZARD_STEP_VALUE_TYPE = 'string' | 'number' | 'date' | 'boolean';

export type HandlerType = 'request' | 'answer';

export type PathValue<
  T,
  P extends string,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type PathsToStringProps<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}` | `${K & string}.${PathsToStringProps<T[K]> & string}`
        : `${K & string}`;
    }[keyof T]
  : never;

type BaseStep = {
  message: string;
};

type HandlerStep<T> = BaseStep & {
  handler: (ctx: StepWizardContext<T>, type: HandlerType) => Promise<boolean>;
};

type FieldStep<T> = BaseStep & {
  field: PathsToStringProps<T>;
  type: WIZARD_STEP_VALUE_TYPE;
  required?: boolean;
};

export type WizardStep<T> = HandlerStep<T> | FieldStep<T>;

export type WizardHandlerConfig<T> = {
  beforeFirstStep?: (ctx: StepWizardContext<T>) => Promise<void>;
  initialSteps: WizardStep<T>[];
  afterLastStep: (ctx: StepWizardContext<T>) => Promise<void>;
};
