import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    const mongoURI = 'mongodb://mongodb-event-srv:27017/event_command';

    try {
        await mongoose
            .connect(mongoURI)
            .then(() => { console.log('Mongo connected successfully.'); })
            .catch((error) => console.log(error));

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};