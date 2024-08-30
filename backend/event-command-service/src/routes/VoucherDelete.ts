import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import axios from 'axios';

const router = express.Router();

router.use(express.json());

router.delete('/api/event_command/voucher/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await Voucher.findOneAndDelete({ _id: id });

        if (!result) {
            throw new BadRequestError('Voucher not found');
        }
        //Remove the voucher from the event
        if (result.eventId !== null) {
            const event = await Event.findByIdAndUpdate(result.eventId, { $pull: { vouchers: result._id } });
            if (!event) {
                throw new BadRequestError('Event not found');
            }
            await event.save();
            console.log('Voucher removed from the event');
        }

        // Delete the image from the image service
        const imageName = result.imageUrl.split('/').pop();
        const response = await axios.delete(`http://image-srv:3000/api/image/deleting/${imageName}`);

        if (response.status !== 200) {
            throw new BadRequestError('Image not found to delete');
        }

        // Publish the deleted voucher to the exchanges
        await publishToExchanges('voucher_deleted', result._id);
        console.log('Voucher deleted successfully');
        res.status(200).send();

    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
