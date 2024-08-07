import mongoose from 'mongoose';

// The interface that describe the properties that an event has
interface EventAttrs {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

// The interface that describe the properties that an event model has
interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
}

// The interface that describe the properties that an event document has
interface EventDoc extends mongoose.Document {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

const EventSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        description: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    }
);

EventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
}
const Event = mongoose.model<EventDoc, EventModel>('Event', EventSchema);


export { Event };