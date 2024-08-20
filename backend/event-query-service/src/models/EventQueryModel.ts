import mongoose from 'mongoose';
import { GameAttrs, GameSchema } from './GameQueryModel';
import { VoucherAttrs, VoucherSchema } from './VoucherQueryModel';

// The interface that describe the properties that an event has
interface EventAttrs {
    _id: mongoose.Types.ObjectId,
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    games: GameAttrs[];
    vouchers: VoucherAttrs[];
}

// The interface that describe the properties that an event model has
interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
}

// The interface that describe the properties that an event document has
interface EventDoc extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    games: GameAttrs[];
    vouchers: VoucherAttrs[];
}

const EventSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    games: { type: [GameSchema], required: false },
    vouchers: { type: [VoucherSchema], required: false }
});

EventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
}
const Event = mongoose.model<EventDoc, EventModel>('Events', EventSchema);


export { Event };