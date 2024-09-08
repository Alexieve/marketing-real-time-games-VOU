import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserEventFavoriteAttrs {
    userID: string;
    eventID: mongoose.Types.ObjectId;
}

interface UserEventFavoriteDoc extends Document {
    userID: string;
    eventID: mongoose.Types.ObjectId;
}

interface UserEventFavoriteModel extends Model<UserEventFavoriteDoc> {
    build(attrs: UserEventFavoriteAttrs): UserEventFavoriteDoc;
}

const UserEventFavoriteSchema = new Schema<UserEventFavoriteDoc>({
    userID: { type: String, required: true, index: true },
    eventID: { type: mongoose.Schema.Types.ObjectId, required: true },
});

UserEventFavoriteSchema.statics.build = (attrs: UserEventFavoriteAttrs) => {
    return new UserEventFavorite(attrs);
};

const UserEventFavorite = mongoose.model<UserEventFavoriteDoc, UserEventFavoriteModel>('UserEventFavorites', UserEventFavoriteSchema, 'UserEventFavorites');

export { UserEventFavorite };
