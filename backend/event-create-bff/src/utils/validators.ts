import { body } from 'express-validator';

const eventValidator = [
  body('name').notEmpty().withMessage('Title is required'),
  body('imageUrl').notEmpty().withMessage('Image is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('games').notEmpty().withMessage('Games are required'),
  body('vouchers').notEmpty().withMessage('Vouchers are required'),
];

export { eventValidator };
