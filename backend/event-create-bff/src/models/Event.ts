import mongoose from 'mongoose';
import { IGame, GameSchema } from './Game';
import { IVoucher, VoucherSchema } from './Voucher';

// The interface that describe the properties that an event has
interface EventAttrs {
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    games: IGame[];
    vouchers: IVoucher[];
}

// The interface that describe the properties that an event model has
interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
}

// The interface that describe the properties that an event document has
interface EventDoc extends mongoose.Document {
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    games: IGame[];
    vouchers: IVoucher[];
}

const EventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        description: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        games: { type: [GameSchema], required: true },
        vouchers: { type: [VoucherSchema], required: true }
    }
);

EventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
}
const Event = mongoose.model<EventDoc, EventModel>('Event', EventSchema);


export { Event };