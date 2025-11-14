import { body } from 'express-validator';

const WEBSITE_RE =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body('name')
  .isString()
  .withMessage('Name should be string')
  .trim()
  .isLength({ max: 15 })
  .withMessage('Length of name cannot be more than 15')
  .notEmpty()
  .withMessage('Name cannot be empty');

const descriptionValidation = body('description')
  .isString()
  .withMessage('Description should be string')
  .trim()
  .isLength({ max: 500 })
  .withMessage('Length of description cannot be more that 500')
  .notEmpty()
  .withMessage('Description cannot be empty');

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('websiteUrl should be string')
  .trim()
  .isLength({ max: 100 })
  .withMessage('Length of websiteUrl cannot be more than 100')
  .matches(WEBSITE_RE)
  .withMessage('websiteUrl should be a valid https URL')
  .notEmpty()
  .withMessage('websiteUrl cannot be empty');

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
