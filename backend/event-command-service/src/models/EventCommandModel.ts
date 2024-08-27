import mongoose from 'mongoose';

// The interface that describe the properties that an event has
interface EventAttrs {
    name: string;
    imageUrl: string | '';
    description: string;
    startTime: Date;
    endTime: Date;
    brand: string;
    gamesId: mongoose.Types.ObjectId[] | null;
}

// The interface that describe the properties that an event model has
interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
}

// The interface that describe the properties that an event document has
interface EventDoc extends mongoose.Document {
    name: string;
    imageUrl: string | '';
    description: string;
    startTime: Date;
    endTime: Date;
    brand: string;
    gamesId: mongoose.Types.ObjectId[] | null;
}

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: false, default: '' },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    brand: { type: String, required: true },
    gamesId: { type: [mongoose.Schema.Types.ObjectId], required: true }
}, {
    timestamps: true
});

EventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
}
const Event = mongoose.model<EventDoc, EventModel>('Events', EventSchema, 'Events');


export { Event, EventAttrs };