import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { pool } from '../connection';
const route = express.Router();


  route.post('/api/usermanagement/delete', async (req: Request, res: Response) => {
      const { id, role } = req.body;
      if (role === 'User') {
        // Xóa bản ghi tương ứng trong bảng CUSTOMER nếu role là 'user'
        await pool.query(
          'DELETE FROM "CUSTOMER" WHERE userid = $1',
          [id]
        );
      }
      if (role === 'Brand') {
        // Xóa bản ghi tương ứng trong bảng CUSTOMER nếu role là 'user'
        await pool.query(
          'DELETE FROM "BRAND" WHERE userid = $1',
          [id]
        );
      }
      const result = await pool.query(
        'DELETE FROM "USER" WHERE id = $1',
        [id]
      );
  
      if (result.rowCount === 0) {
        //res.status(200).send('1');
        throw new BadRequestError('Can not delele user');
      }
  
      res.status(200).send('Done');

  });
  
export {route as usermanagementRouter_Delete};
