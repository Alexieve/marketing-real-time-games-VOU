import express, {Request, Response} from 'express';
import { Brand } from '../models/brand';
import { BadRequestError } from '@vmquynh-vou/shared';
const route = express.Router();

route.post('/api/user/get/user/by-email', async (req: Request, res: Response) => {
    const {email} = req.body;

    const existingBrand = await Brand.findByEmail(email);

    if (!existingBrand) {
        throw new BadRequestError('Account does not exists!');
    }

    res.status(201).send(existingBrand);
});

export {route as getRouter};