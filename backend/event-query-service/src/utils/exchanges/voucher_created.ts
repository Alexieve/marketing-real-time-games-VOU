import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';
import { Game } from '../../models/GameQueryModel';

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
                    qrCodeUrl: voucher_msg.qrCodeUrl,
                    imageUrl: voucher_msg.imageUrl,
                    price: voucher_msg.price,
                    description: voucher_msg.description,
                    quantity: voucher_msg.quantity,
                    expTime: voucher_msg.expTime,
                    status: voucher_msg.status,
                    brand: voucher_msg.brand,
                    eventId: voucher_msg.eventId
                });
                await voucher.save();
                console.log("Voucher saved");
            }
        } catch (error) {
            console.error('Error processing voucher_created:', error);
        }
    },
}