import express, { Request, Response } from 'express';
import { Voucher } from '../models/VoucherCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/voucher_detail/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    res.status(200).send(voucher);

});

export = router;
