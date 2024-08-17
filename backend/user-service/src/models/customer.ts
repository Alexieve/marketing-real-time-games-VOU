import db from '../connection';
import { User, IUser } from './user';

interface ICustomer extends IUser {
    gender: string;
}

export class Customer extends User {
    gender: string;

    constructor({ id, name, email, phonenum, password, status, gender}: ICustomer) {
        super({ id, name, email, phonenum, password, role: 'Customer', status });
        this.gender = gender;
    }

    static async createBrand({ name, email, phonenum, password, status, gender}
        : { name: string; email: string; phonenum: string; password: string; status: boolean; gender: string;})
        : Promise<Customer> {
        try {
            const user = await User.create({ name, email, phonenum, password, role: 'Customer', status });
            await db.query(
                'CALL SP_CREATE_CUSTOMER($1, $2)',
                [user.id, gender]
            );
            return new Customer({ ...user, gender });
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }
}
