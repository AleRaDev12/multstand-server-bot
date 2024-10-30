import { WizardStep } from './types';
import { parseValue } from './utils';
import { WizardData } from './wizard-context-types';

export function createWizardData<T>(
  initialSteps: WizardStep<T>[],
): WizardData<T> {
  return {
    values: {} as T,
    meta: {
      steps: [...initialSteps],
    },
  };
}

export function validateAndParseStepInput<T>(
  step: WizardStep<T>,
  text?: string,
): { isValid: boolean; value?: any; error?: string } {
  // *-* не нужно, сюда ижём только из обычного
  if ('handler' in step) {
    return { isValid: true };
  }

  if ('field' in step) {
    if (!text && step.required !== false) {
      return { isValid: false, error: 'Field is required' };
    }

    if (!text) {
      return { isValid: true };
    }

    try {
      const value = parseValue(text, step.type);
      return { isValid: true, value };
    } catch (error) {
      return { isValid: false, error: `Invalid input: ${error.message}` };
    }
  }

  return { isValid: true };
}
