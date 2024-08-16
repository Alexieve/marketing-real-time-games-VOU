import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { pool } from '../connection';
const route = express.Router();

// route.get('/api/usermanagement/load', async (req: Request, res: Response) => {
//       const users = await User.findAllUser();
//       if (!users) {
//         throw new BadRequestError('Can not load data');
//       }
//       //console.log('check Users:', users);
//       res.send(users);

//   });
// route.post('/api/usermanagement/update', async (req: Request, res: Response) => {
//       const { id, name, status } = req.body; 
//       const result = await pool.query(
//         'UPDATE "USER" SET name = $1, status = $2 WHERE id = $3',
//         [name, status, id]
//     );
//       if (!result) {
//         throw new BadRequestError('Can not find user to update');
//     }
//       res.status(200).send('Done');

//   });
  route.post('/api/usermanagement/addadmin', async (req: Request, res: Response) => {
      const {name, email, phone, password, role,status} = req.body;

      const chec = await pool.query(
        'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
        [email]
      );
      if (chec.rows.length > 0) {
        throw new BadRequestError('Email in use');
      }
      const hashedPassword = await Password.hash(password);
      const phonenum = phone;
      const result = await pool.query(
        'CALL SP_CREATE_USER($1, $2, $3, $4, $5, $6)', 
          [name, email, phonenum, hashedPassword, role, status]
    );
      if (!result) {
        throw new BadRequestError('Can not create user admin');
    }
      res.status(200).send('Done');
  });

  route.post('/api/usermanagement/addbrand', async (req: Request, res: Response) => {
      const {name, email, phone, password, role,status, field, address} = req.body;
      const chec = await pool.query(
        'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
        [email]
      );
      if (chec.rows.length > 0) {
        throw new BadRequestError('Email in use');
      }
      const hashedPassword = await Password.hash(password);
      const phonenum = phone;
      const result = await pool.query(
        'CALL SP_CREATE_USER($1, $2, $3, $4, $5, $6)', 
          [name, email, phonenum, hashedPassword, role, status]
      );
      const temp = await pool.query(
        'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
                [email]
      );
      const result3 = await pool.query(
          'CALL SP_CREATE_BRAND($1, $2, $3, $4, $5)',
            [temp.rows[0].id, field, address, 0, 0]
      );
      res.status(200).send('Done');
  });
  route.post('/api/usermanagement/addcus', async (req: Request, res: Response) => {
    const {name, email, phone, password, role,status, gender, facebookUrl} = req.body;
    const chec = await pool.query(
      'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
      [email]
    );
    if (chec.rows.length > 0) {
      throw new BadRequestError('Email in use');
    }
    const hashedPassword = await Password.hash(password);
    const phonenum = phone;
    const result = await pool.query(
      'CALL SP_CREATE_USER($1, $2, $3, $4, $5, $6)', 
        [name, email, phonenum, hashedPassword, role, status]
    );
    const temp = await pool.query(
      'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
              [email]
    );
    const result3 = await pool.query(
        'CALL SP_CREATE_CUS($1, $2, $3, $4)',
          [temp.rows[0].id, gender, facebookUrl,facebookUrl]
    );
    res.status(200).send('Done');
});
export {route as usermanagementRouter};
