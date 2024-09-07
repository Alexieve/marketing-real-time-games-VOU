import express, { Request, Response } from 'express';
import { Voucher } from '../models/VoucherCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/get_vouchers/:brand', async (req: Request, res: Response) => {
    const { brand } = req.params;
    const vouchers = await Voucher.find({ brand: brand });
    res.status(200).send(vouchers);
});

router.get('/api/event_command/get_vouchers_for_create_event/:brand', async (req: Request, res: Response) => {
    const { brand } = req.params;
    const vouchers = await Voucher.find({ brand: brand, eventID: null });
    res.status(200).send(vouchers);
});

export = router;
