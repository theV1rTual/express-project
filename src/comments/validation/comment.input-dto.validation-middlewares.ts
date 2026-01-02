import { body } from 'express-validator';

const contentValidation = body('content')
  .isString()
  .withMessage('Content should be a string')
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage('Content cannot be more than 300 and less than 20');

export const commentCreateInputValidation = [contentValidation];
