import { ValidationErrorType } from '../types/validationErrorType';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorMessages: ValidationErrorType[] } => {
  return { errorMessages: errors };
};
