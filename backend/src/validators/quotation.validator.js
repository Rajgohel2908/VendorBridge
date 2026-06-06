import { body } from 'express-validator';

export const quotationValidator = [
  body('rfqId').notEmpty().withMessage('RFQ is required'),
  body('vendorId').notEmpty().withMessage('Vendor is required'),
  body('price').isNumeric().withMessage('Price is required'),
  body('deliveryDays').isNumeric().withMessage('Delivery days are required'),
];
