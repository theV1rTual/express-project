import { body } from 'express-validator';

export const loginValidation = body('login')
  .isString()
  .withMessage('Login should be string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Length of login cannot be less than 3 and more than 10')
  .notEmpty()
  .withMessage('Login cannot be empty')
  .matches('^[a-zA-Z0-9_-]*$')
  .withMessage('login should match the pattern');

export const passwordValidation = body('password')
  .isString()
  .withMessage('Password should be string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Length of password cannot be less than 6 and more than 20')
  .notEmpty()
  .withMessage('Password cannot be empty');

export const emailValidation = body('email')
  .isString()
  .withMessage('Email should be string')
  .matches('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
  .withMessage('Email should match the pattern');

export const userCreateInputValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];
