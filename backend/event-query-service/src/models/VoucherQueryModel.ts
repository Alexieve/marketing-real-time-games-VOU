import mongoose, { Schema, Document, Model } from 'mongoose';

interface VoucherAttrs {
    _id: mongoose.Types.ObjectId,
    code: string;
    qrCodeUrl: string;
    imageUrl: string;
    price: string;
    description: string;
    quantity: number;
    expTime: Date;
    status: string;
    brand: string;
    eventID: mongoose.Types.ObjectId | null;
}

interface VoucherDoc extends Document {
    _id: mongoose.Types.ObjectId,
    code: string;
    qrCodeUrl: string;
    imageUrl: string;
    price: string;
    description: string;
    quantity: number;
    expTime: Date;
    status: string;
    brand: string;
    eventID: mongoose.Types.ObjectId | null;
}

interface VoucherModel extends Model<VoucherDoc> {
    build(attrs: VoucherAttrs): VoucherDoc;
}

const VoucherSchema = new Schema<VoucherDoc>({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: String, required: true },
    qrCodeUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    expTime: { type: Date, required: true },
    status: { type: String, required: true },
    brand: { type: String, required: true },
    eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: false }
});

VoucherSchema.statics.build = (attrs: VoucherAttrs) => {
    return new Voucher(attrs);
};

const Voucher = mongoose.model<VoucherDoc, VoucherModel>('Vouchers', VoucherSchema, 'Vouchers');

export { Voucher, VoucherAttrs, VoucherSchema };
