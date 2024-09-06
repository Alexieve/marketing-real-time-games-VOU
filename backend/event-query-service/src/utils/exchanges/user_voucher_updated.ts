import { Voucher } from '../../models/VoucherQueryModel';
import { Event } from '../../models/EventQueryModel';
import { UserVoucher } from '../../models/UserVoucherQueryModel';

export const user_voucher_updated = {
    exchange: 'user_voucher_updated',
    callback: async (msg: any) => {
        try {
            if (msg) {
                const user_voucher_msg = JSON.parse(msg.content.toString());
                console.log("Received voucher:", user_voucher_msg.voucherID);
                console.log("Received user:", user_voucher_msg.userID);
                console.log("Received quantity:", user_voucher_msg.quantity);
                console.log("Received event:", user_voucher_msg.eventID);

                // Find the voucher
                const voucher = await Voucher.findById(user_voucher_msg.voucherID);
                if (!voucher) {
                    throw new Error('Voucher not found');
                }
                // Update the voucher quantity
                voucher.quantity -= user_voucher_msg.quantity;
                await voucher.save();

                // Find the user voucher
                const userVoucher = await UserVoucher.findOne({ userID: user_voucher_msg.userID, voucherID: user_voucher_msg.voucherID });
                if (!userVoucher) {
                    // Create a new user voucher
                    const newUserVoucher = UserVoucher.build({
                        userID: user_voucher_msg.userID,
                        voucherID: user_voucher_msg.voucherID,
                        quantity: user_voucher_msg.quantity,
                        code: voucher.code,
                        imageUrl: voucher.imageUrl,
                        price: voucher.price,
                        description: voucher.description,
                        expTime: voucher.expTime,
                        status: voucher.status,
                        brand: voucher.brand,
                        eventID: user_voucher_msg.eventID
                    });
                    await newUserVoucher.save();
                }
                else {
                    // Update the user voucher quantity
                    userVoucher.quantity += user_voucher_msg.quantity;
                    await userVoucher.save();
                }



                // Find the event that stores voucher in the the vouchers list and update the quantity
                const event = await Event.findById(user_voucher_msg.eventID);
                if (!event) {
                    throw new Error('Event not found');
                }
                // Find the voucher in the event
                const event_voucher = event.vouchers.find(voucher => voucher._id.toString() === user_voucher_msg.voucherID);
                if (!event_voucher) {
                    throw new Error('Voucher not found in the event');
                }
                // Update the voucher quantity in the event
                event_voucher.quantity -= user_voucher_msg.quantity;
                await event.save();

                console.log("User voucher updated");
            }
        } catch (error) {
            console.error('Error processing voucher_created:', error);
        }
    },
} 