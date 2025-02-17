import { EventVoucher } from '../../models/EventVoucherQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';

export const voucher_updated = {
    exchange: 'voucher_updated',
    callback: async (msg: any) => {
        if (msg) {
            try {
                const voucher_msg = JSON.parse(msg.content.toString());
                console.log("Received voucher_updated:", voucher_msg._id);
                const voucher = await Voucher.findById(voucher_msg._id);
                if (!voucher) {
                    throw new Error("Voucher not found");
                }
                voucher.set({
                    code: voucher_msg.code,
                    imageUrl: voucher_msg.imageUrl,
                    price: voucher_msg.price,
                    description: voucher_msg.description,
                    quantity: voucher_msg.quantity,
                    expTime: voucher_msg.expTime,
                    status: voucher_msg.status,
                    brand: voucher_msg.brand,
                });
                await voucher.save();
                // Update the voucher data in the event
                if (voucher.eventID !== null) {
                    const result = await EventVoucher.updateOne(
                        {
                            '_id': voucher.eventID,
                            'vouchers._id': voucher._id
                        },
                        {
                            $set: {
                                'vouchers.$.code': voucher_msg.code,
                                'vouchers.$.imageUrl': voucher_msg.imageUrl,
                                'vouchers.$.price': voucher_msg.price,
                                'vouchers.$.description': voucher_msg.description,
                                'vouchers.$.quantity': voucher_msg.quantity,
                                'vouchers.$.expTime': voucher_msg.expTime,
                                'vouchers.$.status': voucher_msg.status,
                                'vouchers.$.brand': voucher_msg.brand,
                            },
                        }
                    );
                    if (!result) {
                        throw new Error("Voucher not found in event");
                    }
                }
                console.log("Voucher updated");
            }
            catch (error) {
                console.error('Error processing voucher_updated:', error);
            }
        }
    },
}