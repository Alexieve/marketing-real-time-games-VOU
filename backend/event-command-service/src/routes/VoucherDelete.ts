import express, { Request, Response } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import axios from 'axios';

const router = express.Router();

router.use(express.json());

router.delete('/api/event_command/voucher/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await Voucher.findOneAndDelete({ _id: id });

    if (!result) {
        throw new BadRequestError('Voucher not found');
    }
    //Remove the voucher from the event
    if (result.eventID !== null) {
        const event = await Event.findByIdAndUpdate(result.eventID, { $pull: { vouchers: result._id } });
        if (!event) {
            throw new BadRequestError('Event not found');
        }
        await event.save();
        console.log('Voucher removed from the event');
    }

    // Delete the image from the image service
    // imageUrl = images/voucher/imageName, only take /voucher/imageName
    const imageName = result.imageUrl.split('/').slice(1).join('/');
    console.log(imageName);
    const response = await axios.delete(`http://image-srv:3000/api/image/deleting/${imageName}`, {
        headers: { 'Content-Type': 'application/json' },
    });

    // Publish the deleted voucher to the exchanges
    await publishToExchanges('voucher_deleted', result._id);
    console.log('Voucher deleted successfully');
    res.status(200).send();
});

export = router;
