import mongoose, { Schema, Document, Model } from 'mongoose';

interface GameAttrs {
    _id: mongoose.Types.ObjectId,
    name: string;
    type: string;
    imageUrl: string;
    isExchange: boolean;
    guide: string;
}

interface GameDoc extends Document {
    _id: mongoose.Types.ObjectId,
    name: string;
    type: string;
    imageUrl: string;
    isExchange: boolean;
    guide: string;
}

interface GameModel extends Model<GameDoc> {
    build(attrs: GameAttrs): GameDoc;
}

const GameSchema = new Schema<GameDoc>({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isExchange: { type: Boolean, required: true },
    guide: { type: String, required: true }
});

GameSchema.statics.build = (attrs: GameAttrs) => {
    return new Game(attrs);
};

const Game = mongoose.model<GameDoc, GameModel>('Games', GameSchema, 'Games');

export { Game, GameAttrs, GameSchema };