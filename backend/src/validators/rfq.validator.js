import { body } from 'express-validator';

export const rfqValidator = [
  body('title').notEmpty().withMessage('RFQ title is required'),
  body('quantity').isNumeric().withMessage('Quantity is required'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
];
