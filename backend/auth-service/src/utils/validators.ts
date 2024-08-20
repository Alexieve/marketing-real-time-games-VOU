import { body } from 'express-validator';

const brandRegisterValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Name must be between 2 and 20 characters'),

  body('email')
    .isEmail()
    .withMessage('Email must be valid'),

  body('phonenum')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
    .withMessage('Phone number must be valid'),
    
  body('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),

  body('field')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Field must be between 2 and 255 characters'),

  body('address')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Address must be between 2 and 255 characters')
];

const customerRegisterValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Name must be between 2 and 20 characters'),

  body('email')
    .isEmail()
    .withMessage('Email must be valid'),

  body('phonenum')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
    .withMessage('Phone number must be valid'),
    
  body('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),

  body('gender')
    .isIn(['Nam', 'Nữ'])
    .withMessage('Gender must be "Nam" or "Nữ"')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),

  body('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters')
];

export {brandRegisterValidator, customerRegisterValidator, loginValidator};
