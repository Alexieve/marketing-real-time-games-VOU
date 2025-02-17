import mongoose, { Schema, Document, Model } from 'mongoose';

interface VoucherAttrs {
  code: string;
  imageUrl: string | '';
  price: number;
  description: string;
  quantity: number;
  expTime: Date;
  status: string;
  brand: string;
  eventID: mongoose.Types.ObjectId | null;
}

interface VoucherDoc extends Document {
  code: string;
  imageUrl: string | '';
  price: number;
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

const voucherSchema = new Schema<VoucherDoc>({
  code: { type: String, required: true },
  imageUrl: { type: String, required: false, default: '' },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  expTime: { type: Date, required: true },
  status: { type: String, required: true },
  brand: { type: String, required: true, index: true },
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: false, default: null }
}, {
  timestamps: true
});

voucherSchema.statics.build = (attrs: VoucherAttrs) => {
  return new Voucher(attrs);
};

const Voucher = mongoose.model<VoucherDoc, VoucherModel>('Vouchers', voucherSchema, 'Vouchers');

export { Voucher, VoucherAttrs, VoucherDoc };
