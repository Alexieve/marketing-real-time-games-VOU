import { body } from 'express-validator';

const voucherValidator = [
    body('code').notEmpty().withMessage('Code is required'),
    body('qrCodeUrl').notEmpty().withMessage('QR Code URL is required'),
    // body('imageUrl').notEmpty().withMessage('Image URL is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('expTime').notEmpty().withMessage('Expiration time is required'),
    body('status').notEmpty().withMessage('Status is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
];

export { voucherValidator };