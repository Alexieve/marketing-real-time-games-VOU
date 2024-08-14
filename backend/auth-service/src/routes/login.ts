import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '@vmquynh-vou/shared';
import jwt from 'jsonwebtoken';
import { requestAPI } from '@vmquynh-vou/shared';


const route = express.Router();

route.post('/api/auth/login', loginValidator, validateRequest,
async (req: Request, res: Response) => {

    const {email, password} = req.body;

    let existingUser = null;
    try {
        existingUser = await requestAPI('http://user-srv:3000/api/user/get/user/by-email', 'POST', {email});
    } catch (error: any) {
        if (error == 'Account does not exists!')
            throw new BadRequestError('Wrong email or password');
        else
            throw new BadRequestError(error);
    }

    if (!existingUser) {
        throw new BadRequestError('Wrong email or password');
    }

    const passwordsMatch = await Password.compare(password, existingUser.password);

    if (!passwordsMatch) {
        throw new BadRequestError('Wrong email or password');
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phonenum: existingUser.phonenum,
        status: existingUser.status,
        role: existingUser.role
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    };
    return res.status(200).send(existingUser);
});

export {route as loginRouter};