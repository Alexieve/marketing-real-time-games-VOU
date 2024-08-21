import { body } from 'express-validator';

const gameInforValidator = [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required'),

  body('type')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required'),

  body('image')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Image is required'),
    
  body('isTrading')
    .isBoolean()
    .withMessage('Trading must be true or false'),

  body('instructions')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Image is required'),
];

export {gameInforValidator};
