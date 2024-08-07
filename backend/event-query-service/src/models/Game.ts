import mongoose, { Schema } from 'mongoose';

export interface IGame {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    isExchange: boolean;
    guide: string;
}

export const GameSchema: Schema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        imageUrl: { type: String, required: true },
        isExchange: { type: Boolean, required: true },
        guide: { type: String, required: true }
    },
    {
        _id: false
    }
);