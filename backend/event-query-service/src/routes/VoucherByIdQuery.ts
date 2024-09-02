import express, { Request, Response } from 'express';
import { Voucher } from '../models/VoucherQueryModel';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.use(express.json());

router.get('/api/events_query/get_vouchers/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id });

    if (!voucher) {
        throw new BadRequestError('Voucher not found');
    }

    res.status(200).send(voucher);
});

export = router;
