import { pool } from '../connection';
import { User, IUser } from './user';

interface IBrand extends IUser {
    field: string;
    address: string;
    lat: number;
    long: number;
}

export class Brand extends User {
    field: string;
    address: string;
    lat: number;
    long: number;

    constructor({ id, name, email, phonenum, password, status, field, address, lat, long }: IBrand) {
        super({ id, name, email, phonenum, password, role: 'Brand', status });
        this.field = field;
        this.address = address;
        this.lat = lat;
        this.long = long;
    }

    static async createBrand({ name, email, phonenum, password, status, field, address, lat, long }: { name: string; email: string; phonenum: string; password: string; status: boolean; field: string; address: string; lat: number; long: number }): Promise<Brand> {
        const user = await User.create({ name, email, phonenum, password, role: 'Brand', status });

        await pool.query(
            'CALL SP_CREATE_BRAND($1, $2, $3, $4, $5)',
            [user.id, field, address, lat, long]
        );

        return new Brand({ ...user, field, address, lat, long });
    }
}
