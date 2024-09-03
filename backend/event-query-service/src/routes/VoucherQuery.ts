import express, { Request, Response } from 'express';
import { Voucher } from '../models/VoucherQueryModel';
import { UserVoucher } from '../models/UserVoucherQueryModel';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.use(express.json());

router.get('/api/event_query/get_vouchers_by_brand/:brand', async (req: Request, res: Response) => {
    const { brand } = req.params;
    // Find all vouchers for the specified brand
    const vouchers = await Voucher.find({ brand: brand });
    res.status(200).send(vouchers);
});

router.get('/api/event_query/get_vouchers_by_eventID/:eventID', async (req: Request, res: Response) => {
    const { eventID } = req.params;
    // Find all vouchers for the specified event
    const vouchers = await Voucher.find({ eventID: eventID });
    res.status(200).send(vouchers);
});

router.get('/api/events_query/get_vouchers/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id });

    if (!voucher) {
        throw new BadRequestError('Voucher not found');
    }

    res.status(200).send(voucher);
});

export = router;
