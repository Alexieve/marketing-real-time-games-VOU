import express, {Request, Response} from 'express';
import { Customer } from '../models/customer';
import { Brand } from '../models/brand';
import { BadRequestError } from '@vmquynh-vou/shared';
const route = express.Router();

route.post('/api/user-management/delete/:role/:id', async (req: Request, res: Response) => {
    const {role, id} = req.params;
    try {
      if (role === 'Customer') {
        Customer.delete(id);
      }
      if (role === 'Brand') {
        Brand.delete(id);
      }
      else if (role === 'Admin') {
        throw new BadRequestError('Can not delete admin');
      }
    } catch (error) {
      throw new BadRequestError('Can not delete user');
    }
    res.status(200).send('Done');
});
  
export {route as DeleteRoute};
