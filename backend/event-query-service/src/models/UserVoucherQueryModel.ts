import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserVoucherAttrs {
    userID: string;
    voucherID: mongoose.Types.ObjectId;
    quantity: number;
    code: string;
    imageUrl: string;
    price: number;
    description: string;
    expTime: Date;
    status: string;
    brand: string;
    eventID: mongoose.Types.ObjectId | null;
}

interface UserVoucherDoc extends Document {
    userID: string;
    voucherID: mongoose.Types.ObjectId;
    quantity: number;
    code: string;
    imageUrl: string;
    price: number;
    description: string;
    expTime: Date;
    status: string;
    brand: string;
    eventID: mongoose.Types.ObjectId | null;
}

interface UserVoucherModel extends Model<UserVoucherDoc> {
    build(attrs: UserVoucherAttrs): UserVoucherDoc;
}

const UserVoucherSchema = new Schema<UserVoucherDoc>({
    userID: { type: String, required: true, index: true },
    voucherID: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    code: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    expTime: { type: Date, required: true },
    status: { type: String, required: true },
    brand: { type: String, required: true },
    eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: false }
});

UserVoucherSchema.statics.build = (attrs: UserVoucherAttrs) => {
    return new UserVoucher(attrs);
};

const UserVoucher = mongoose.model<UserVoucherDoc, UserVoucherModel>('UserVouchers', UserVoucherSchema, 'UserVouchers');

export { UserVoucher };
