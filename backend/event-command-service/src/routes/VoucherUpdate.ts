import express, { Request, Response } from 'express';
import { Voucher } from '../models/VoucherCommandModel';
import { voucherValidator } from '../utils/voucherValidators';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import { generateImageHashFromBuffer, uploadImageToService, upload } from '../utils/imageUtil';

const router = express.Router();

router.put('/api/event_command/voucher/update/:id', upload.single('imageUrl'), voucherValidator, validateRequest, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { code, price, description, quantity, expTime, status, brand } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        throw new BadRequestError('No image uploaded');
    }

    const voucher = await Voucher.findById(id);
    if (!voucher) {
        throw new BadRequestError('Voucher not found');
    }

    const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + imageFile.mimetype.split('/')[1];
    const newImageName = voucher._id + newImageHash;
    const oldImageName = voucher.imageUrl.split('/').pop() ?? '';

    let newImageUrl = '';
    if (newImageName !== oldImageName) {
        newImageUrl = await uploadImageToService(imageFile, 'voucher', newImageName, oldImageName);
    }
    else {
        newImageUrl = voucher.imageUrl;
    }


    const updateData = {
        code,
        imageUrl: newImageUrl,
        price,
        description,
        quantity,
        expTime,
        status,
        brand,
    };

    voucher.set(updateData);
    await voucher.save();

    await publishToExchanges('voucher_updated', JSON.stringify(voucher.toJSON()));

    console.log('Voucher updated successfully');
    res.status(200).send(voucher);
});

router.put('/api/event_command/voucher/update_quantity/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userID, quantity, eventID } = req.body;

    // Find the voucher
    const voucher = await Voucher.findById(id);
    if (!voucher) {
        throw new BadRequestError('Voucher not found');
    }

    // Check the voucher quantity is greater than the required quantity to update
    if (voucher.quantity < quantity) {
        throw new BadRequestError('Not enough voucher quantity');
    }

    // Update the voucher quantity
    voucher.quantity -= quantity;
    await voucher.save();

    // Publish the event
    await publishToExchanges('user_voucher_updated', JSON.stringify({
        voucherID: id,
        userID,
        quantity,
        eventID
    }));
    console.log('Voucher updated successfully');
    res.status(200).send('Voucher quantity updated successfully with ' + quantity);
});
export = router;