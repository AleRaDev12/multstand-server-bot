import { StepWizardContext } from './wizard-context-types';

export type WIZARD_STEP_VALUE_TYPE = 'string' | 'number' | 'date' | 'boolean';

export type WizardStepCustomHandlerType = 'request' | 'answer';

// Utility type to prevent infinite recursion by limiting depth
type Primitive = string | number | boolean | Date;

export type PathsToStringPropsWithDepth<
  T,
  Depth extends number = 3,
> = T extends Primitive
  ? never
  : T extends Array<infer U>
    ? PathsToStringPropsWithDepth<U, Depth>
    : T extends object
      ? Depth extends 0
        ? never
        : {
            [K in keyof T]: T[K] extends object
              ?
                  | `${K & string}`
                  | `${K & string}.${PathsToStringPropsWithDepth<T[K], Prev[Depth]> & string}`
              : `${K & string}`;
          }[keyof T]
      : never;

// Helper type to decrement number type
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Updated PathValue type
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

type BaseStep = {
  message: string;
  required?: boolean;
};

type FieldStep<T> = BaseStep & {
  field: PathsToStringPropsWithDepth<T>;
  type: WIZARD_STEP_VALUE_TYPE;
};

export type HandlerStep<T, W> = BaseStep & {
  handler: (
    wizard: W,
    ctx: StepWizardContext<T, W>,
    type: WizardStepCustomHandlerType,
  ) => Promise<boolean>;
};

export type WizardStep<T, W> = HandlerStep<T, W> | FieldStep<T>;

export type WizardHandlerConfig<T, W> = {
  beforeFirstStep?: (wizard: W, ctx: StepWizardContext<T, W>) => Promise<void>;
  initialSteps: WizardStep<T, W>[];
  afterLastStep: (wizard: W, ctx: StepWizardContext<T, W>) => Promise<void>;
};
