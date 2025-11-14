import { ValidationErrorType } from '../types/validationErrorType';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorsMessages: ValidationErrorType[] } => {
  return { errorsMessages: errors };
};
