import express, { Request, Response, NextFunction } from 'express';
import { Voucher } from '../models/VoucherQueryModel';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.use(express.json());

router.get('/api/events_query/get_voucher_byId/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const voucher = await Voucher.findOne({ _id: id });

        if (!voucher) {
            throw new BadRequestError('Voucher not found');
        }

        res.status(200).send(voucher);
    }
    catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
