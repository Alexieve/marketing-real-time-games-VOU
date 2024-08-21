import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    const mongoURI = 'mongodb://mongodb-event-query-srv:27017/events_query';

    try {
        await mongoose
            .connect(mongoURI)
            .then(() => { console.log('Mongo connected successfully.'); })
            .catch((error) => console.log(error));

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}; 