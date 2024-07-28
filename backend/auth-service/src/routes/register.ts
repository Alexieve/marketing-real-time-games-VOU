import express, {Request, Response} from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { registerValidator } from '../utils/validators';
import { Brand } from '../models/brand';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const route = express.Router();

route.post('/api/users/register', registerValidator, validateRequest,
async (req: Request, res: Response) => {
    const {name, email, phonenum, password, field, address, lat, long} = req.body;

    const existingBrand = await Brand.findByEmail(email);

    if (existingBrand) {
        throw new BadRequestError('Email in use');
    }

    console.log('Creating a user...');

    const brand = await Brand.createBrand(
        {name, email, phonenum, password, status: true, field, address, lat, long}
    );

    const userJwt = jwt.sign({
        id: brand.id,
        name: brand.name,
        email: brand.email,
        phonenum: brand.phonenum,
        status: brand.status
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    };

    return res.status(201).send(brand);
});

export {route as registerRouter};