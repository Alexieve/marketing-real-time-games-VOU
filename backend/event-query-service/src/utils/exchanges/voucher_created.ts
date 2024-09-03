import { Voucher } from '../../models/VoucherQueryModel';

export const voucher_created = {
    exchange: 'voucher_created',
    callback: async (msg: any) => {
        try {
            if (msg) {
                const voucher_msg = JSON.parse(msg.content.toString());
                console.log("Received voucher:", voucher_msg._id);
                const voucher = Voucher.build({
                    _id: voucher_msg._id,
                    code: voucher_msg.code,
                    imageUrl: voucher_msg.imageUrl,
                    price: voucher_msg.price,
                    description: voucher_msg.description,
                    quantity: voucher_msg.quantity,
                    expTime: voucher_msg.expTime,
                    status: voucher_msg.status,
                    brand: voucher_msg.brand,
                    eventID: voucher_msg.eventID
                });
                await voucher.save();
                console.log("Voucher saved");
            }
        } catch (error) {
            console.error('Error processing voucher_created:', error);
        }
    },
}