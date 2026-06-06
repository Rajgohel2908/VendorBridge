import { body } from 'express-validator';

export const vendorValidator = [
  body('name').notEmpty().withMessage('Vendor name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('email').isEmail().withMessage('Valid vendor email is required'),
];
