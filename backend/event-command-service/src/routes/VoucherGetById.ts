import express, { Request, Response, NextFunction } from 'express';
import { Voucher } from '../models/VoucherCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/voucher_detail/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const voucher = await Voucher.findById(id);
        res.status(200).send(voucher);
    }
    catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
