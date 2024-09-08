import mongoose from 'mongoose';

// The interface that describe the properties that an event has
interface EventAttrs {
    _id: mongoose.Types.ObjectId,
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    brand: string;
    gameID: string;
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
    brand: string;
    gameID: string;
}

const EventSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    brand: { type: String, required: true },
    gameID: { type: String, required: false },
});

EventSchema.index({ startTime: 1, endTime: 1 });

EventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
}
const Event = mongoose.model<EventDoc, EventModel>('Events', EventSchema, 'Events');


export { Event };