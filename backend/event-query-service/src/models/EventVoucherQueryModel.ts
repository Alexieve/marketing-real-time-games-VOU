import mongoose from 'mongoose';
import { VoucherAttrs, VoucherSchema } from './VoucherQueryModel';

// The interface that describe the properties that an event has
interface EventVoucherAttrs {
    _id: mongoose.Types.ObjectId,
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    brand: string;
    gameID: string;
    vouchers: VoucherAttrs[];
}

// The interface that describe the properties that an event model has
interface EventVoucherModel extends mongoose.Model<EventVoucherDoc> {
    build(attrs: EventVoucherAttrs): EventVoucherDoc;
}

// The interface that describe the properties that an event document has
interface EventVoucherDoc extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    brand: string;
    gameID: string;
    vouchers: VoucherAttrs[];
}

const EventVoucherSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    brand: { type: String, required: true },
    gameID: { type: String, required: false },
    vouchers: { type: [VoucherSchema], required: false }
});

EventVoucherSchema.statics.build = (attrs: EventVoucherAttrs) => {
    return new EventVoucher(attrs);
}
const EventVoucher = mongoose.model<EventVoucherDoc, EventVoucherModel>('EventVouchers', EventVoucherSchema, 'EventVouchers');


export { EventVoucher };