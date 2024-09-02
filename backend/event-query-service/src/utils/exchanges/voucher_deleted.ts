import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';
import { Game } from '../../models/GameQueryModel';

export const voucher_deleted = {
    exchange: 'voucher_deleted',
    callback: async (msg: any) => {
        if (msg) {
            try {
                const voucherId = msg.content.toString();
                console.log("Received voucher_deleted:", voucherId);
                const voucher = await Voucher.findByIdAndDelete(voucherId);
                if (!voucher)
                    throw new Error("Voucher not found");
                // Remove the voucher from the event
                if (voucher.eventID !== null) {
                    const event = await Event.findByIdAndUpdate(voucher.eventID, { $pull: { vouchers: { _id: voucherId } } });
                    if (!event) {
                        throw new Error("Event not found");
                    }
                    await event.save();
                    console.log("Voucher removed from the event");
                }
                console.log("Voucher deleted");
            }
            catch (error) {
                console.error('Error processing voucher_deleted:', error);
            }
        }
    }
}