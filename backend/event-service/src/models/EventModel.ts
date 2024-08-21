import mongoose from 'mongoose';

// The interface that describe the properties that an event has
interface EventAttrs {
    name: string;
    imageUrl: string;
    description: string;
    startTime: Date;
    endTime: Date;
    brand: string;
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
    brand: string;
}

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    brand: { type: String, required: true }
}, {
    timestamps: true
});

EventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
}
const Event = mongoose.model<EventDoc, EventModel>('Events', EventSchema);


export { Event, EventAttrs };