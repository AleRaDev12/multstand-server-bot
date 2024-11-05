import { WizardStep } from './types';
import { parseValue, ValidationResult, ValidResult } from './utils';
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
): ValidationResult {
  if (!('field' in step)) {
    return { isValid: false, error: 'field not exists in step' };
  }

  if (!text && step.required !== false) {
    return { isValid: false, error: 'Field is required' };
  }

  if (!text) {
    return { isValid: false, error: 'Text not exists' };
  }

  const parsingResult = parseValue(text, step.type);

  if (isValidResult(parsingResult)) {
    return { isValid: true, value: parsingResult.value };
  }

  return { isValid: false, error: `Invalid input: ${parsingResult.error}` };
}

export const isValidResult = (
  result: ValidationResult,
): result is ValidResult => {
  return result.isValid;
};
