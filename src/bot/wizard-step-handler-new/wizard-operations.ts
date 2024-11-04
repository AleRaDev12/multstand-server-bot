import { WizardStep } from './types';
import { parseValue } from './utils';
import { WizardData } from './wizard-context-types';

export function createWizardData<T, W>(
  initialSteps: WizardStep<T, W>[],
): WizardData<T, W> {
  return {
    values: {} as T,
    meta: {
      steps: [...initialSteps],
    },
  };
}

export function validateAndParseStepInput<T, W>(
  step: WizardStep<T, W>,
  text?: string,
): { isValid: boolean; value?: any; error?: string } {
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
