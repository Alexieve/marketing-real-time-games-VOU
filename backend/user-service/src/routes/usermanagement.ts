import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { pool } from '../connection';
const route = express.Router();

route.get('/api/usermanagement/load', async (req: Request, res: Response) => {
    try {
      const users = await User.findAllUser();
      if (!users) {
        return res.status(404).send({ message: 'No users found' });
      }
      //console.log('check Users:', users);
      res.send(users);
    } catch (error) {
      console.error('Error in /api/usermanagement:', error); // Log error for debugging
    //   res.status(500).send({ message: 'Error fetching users', error: error.message });
    }
  });
route.post('/api/usermanagement/update', async (req: Request, res: Response) => {
    try {
      const { id, name, status } = req.body;
  
      console.log(status);
      console.log(id);
      console.log(name);
  
      const result = await pool.query(
        'UPDATE "USER" SET name = $1, status = $2 WHERE id = $3',
        [name, status, id]
    );
      if (!result) {
        res.status(200).send('1');
        throw new BadRequestError('result not found');
    }
      res.status(200).send('2');
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  });
  route.post('/api/usermanagement/addadmin', async (req: Request, res: Response) => {
    try {
      const {name, email, phone, password, role,status} = req.body;

      const chec = await pool.query(
        'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
        [email]
      );
      if (chec.rows.length > 0) {
        res.status(200).send('1');
        throw new BadRequestError('Email in use');
      }
      const hashedPassword = await Password.hash(password);
      const phonenum = phone;
      const result = await pool.query(
        'CALL SP_CREATE_USER($1, $2, $3, $4, $5, $6)', 
          [name, email, phonenum, hashedPassword, role, status]
    );
      if (!result) {
        res.status(200).send('2');
        throw new BadRequestError('Cannt create user admin');
    }
      res.status(200).send('3');
    } catch (error) {
      console.error('Error create user admin:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  });
  route.post('/api/usermanagement/delete', async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
  
      // Xóa user theo id
      const result = await pool.query(
        'DELETE FROM "USER" WHERE id = $1',
        [id]
      );
  
      if (result.rowCount === 0) {
        res.status(200).send('1');
        throw new BadRequestError('Cannt del user');
      }
  
      res.status(200).send('2');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  });
  route.post('/api/usermanagement/addbrand', async (req: Request, res: Response) => {
    try {
      const {name, email, phone, password, role,status, field, address} = req.body;
      const chec = await pool.query(
        'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
        [email]
      );
      if (chec.rows.length > 0) {
        res.status(200).send('1');
        throw new BadRequestError('Email in use');
        return;
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
      res.status(200).send('3');
    } catch (error) {
      console.error('Error create brand admin:', error);
      res.status(500).json({ message: 'Error create brand' });
    }
  });
export {route as usermanagementRouter};
