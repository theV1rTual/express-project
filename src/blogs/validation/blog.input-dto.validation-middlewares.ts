import { body } from 'express-validator';

const nameValidation = body('name')
  .isString()
  .withMessage('Name should be string')
  .trim()
  .isLength({ max: 15 })
  .withMessage('Length of name cannot be more than 15');

const descriptionValidation = body('description')
  .isString()
  .withMessage('Description should be string')
  .trim()
  .isLength({ max: 500 })
  .withMessage('Length of description cannot be more that 500');

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('websiteUrl should be string')
  .trim()
  .isLength({ max: 100 })
  .withMessage('Length of websiteUrl cannot be more than 100')
  .matches(
    '/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/',
  )
  .withMessage('websiteUrl should be a valid https URL');

export const blogCreateInputValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];

export const blogUpdateInputValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
