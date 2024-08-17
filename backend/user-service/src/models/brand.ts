import db from '../connection';
import { User, IUser } from './user';

interface IBrand extends IUser {
    field: string;
    address: string;
}

export class Brand extends User {
    field: string;
    address: string;

    constructor({ id, name, email, phonenum, password, status, field, address}: IBrand) {
        super({ id, name, email, phonenum, password, role: 'Brand', status });
        this.field = field;
        this.address = address
    }

    static async createBrand({ name, email, phonenum, password, status, field, address}
        : { name: string; email: string; phonenum: string; password: string; status: boolean; field: string; address: string;})
        : Promise<Brand> {
        try {
            const user = await User.create({ name, email, phonenum, password, role: 'Brand', status });
            await db.query(
                'CALL SP_CREATE_BRAND($1, $2, $3)',
                [user.id, field, address]
            );
            return new Brand({ ...user, field, address });
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    }
}
