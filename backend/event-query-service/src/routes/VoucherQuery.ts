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
    // Find all vouchers for the specified event, order by status, expiry date
    const vouchers = await Voucher.find({ eventID: eventID }).sort({ status: 1, expiryDate: 1 });
    res.status(200).send(vouchers);
});

router.get('/api/event_query/get_vouchers/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id });

    if (!voucher) {
        throw new BadRequestError('Voucher not found');
    }

    res.status(200).send(voucher);
});

router.get('/api/event_query/get_user_vouchers/:userID', async (req: Request, res: Response) => {
    const { userID } = req.params;
    const userVouchers = await UserVoucher.find({ userID: userID });
    if (!userVouchers) {
        res.status(200).send({ message: 'User has no voucher' });
    }

    // Take the vouchers data of the user
    const vouchers = await Voucher.find({ _id: { $in: userVouchers.map(voucher => voucher.voucherID) } });
    res.status(200).send(vouchers);

    res.status(200).send(userVouchers);
});

export = router;
