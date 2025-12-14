import { body } from 'express-validator';

const titleValidation = body('title')
  .isString()
  .withMessage('Title should be a string')
  .trim()
  .isLength({ max: 30 })
  .withMessage('Length of title cannot be more than 30')
  .notEmpty()
  .withMessage('Title cannot be empty');

const shortDescriptionValidation = body('shortDescription')
  .isString()
  .withMessage('shortDescription should be a string')
  .trim()
  .isLength({ max: 100 })
  .withMessage('Length of shortDescription cannot be more than 100')
  .notEmpty()
  .withMessage('shortDescription cannot be empty');

const contentValidation = body('content')
  .isString()
  .withMessage('content should be a string')
  .trim()
  .isLength({ max: 1000 })
  .withMessage('Length of content cannot be more than 1000')
  .notEmpty()
  .withMessage('content cannot be empty');

const blogIdValidation = body('blogId')
  .isString()
  .withMessage('content should be a string')
  .trim()
  .notEmpty()
  .withMessage('content cannot be empty');

export const postCreateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

export const postForBlogCreateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
];

export const postUpdateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
