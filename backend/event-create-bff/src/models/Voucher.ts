import mongoose, { Schema } from 'mongoose';

export interface IVoucher {
    code: string;
    qrCodeUrl: string;
    imageUrl: string;
    price: string;
    description: string;
    quantity: number;
    expTime: Date;
    status: string;
    brand: string;
    id: string;
}

export const VoucherSchema: Schema = new Schema(
    {
        code: { type: String, required: true },
        qrCodeUrl: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        expTime: { type: Date, required: true },
        status: { type: String, required: true },
        brand: { type: String, required: true },
        id: { type: String, required: true }
    },
    {
        _id: false
    }
);