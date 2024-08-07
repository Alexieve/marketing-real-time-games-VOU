import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';


const route = express.Router();

route.post('/api/users/login', loginValidator, validateRequest,
async (req: Request, res: Response) => {

    const {email, password} = req.body;

    const existingUser = await User.findByEmail(email);
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