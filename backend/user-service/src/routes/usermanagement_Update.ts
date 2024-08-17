import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { pool } from '../connection';
const route = express.Router();


route.post('/api/usermanagement/update', async (req: Request, res: Response) => {
      const { id, name, status } = req.body; 
      const result = await pool.query(
        'UPDATE "USER" SET name = $1, status = $2 WHERE id = $3',
        [name, status, id]
    );
      if (!result) {
        throw new BadRequestError('Can not find user to update');
    }
      res.status(200).send('Done');

  });
  
export {route as usermanagementRouter_Update};
