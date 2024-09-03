import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserVoucherAttrs {
    userID: string;
    voucherID: mongoose.Types.ObjectId;
    quantity: number;
}

interface UserVoucherDoc extends Document {
    userID: string;
    voucherID: mongoose.Types.ObjectId;
    quantity: number;
}

interface UserVoucherModel extends Model<UserVoucherDoc> {
    build(attrs: UserVoucherAttrs): UserVoucherDoc;
}

const UserVoucherSchema = new Schema<UserVoucherDoc>({
    userID: { type: String, required: true },
    voucherID: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true }
});

UserVoucherSchema.statics.build = (attrs: UserVoucherAttrs) => {
    return new UserVoucher(attrs);
};

const UserVoucher = mongoose.model<UserVoucherDoc, UserVoucherModel>('UserVouchers', UserVoucherSchema, 'UserVouchers');

export { UserVoucher };
