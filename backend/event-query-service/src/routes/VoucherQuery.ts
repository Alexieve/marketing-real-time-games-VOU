import express, { Request, Response, NextFunction } from 'express';
import { Voucher } from '../models/VoucherQueryModel';

const router = express.Router();

router.use(express.json());

router.get('/api/events_query/get_vouchers', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vouchers = await Voucher.find({});
        res.status(200).send(vouchers);
    }
    catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
