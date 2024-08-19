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
            const user = await super.create({ name, email, phonenum, password, role: 'Brand', status });
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

    static async findByEmail(email: string): Promise<Brand | null> {
        try {
            const brand = await db.query(
                'SELECT * FROM FUNC_FIND_BRAND_BY_EMAIL($1)',
                [email]
            );
            if (brand.rows.length === 0) return null
            return new Brand(brand.rows[0]);
        } catch (error) {
            console.error('Error finding brand by email:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<User | null> {
        const brand = await db.query(
            'SELECT * FROM FUNC_FIND_BRAND_BY_ID($1)',
            [id]
        );
        if (brand.rows.length === 0) return null
        return new Brand(brand.rows[0]);
    }

    static async findAll(): Promise<User[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_FIND_ALL_BRAND()'
            );
            if (res.rows.length === 0) return null;
            return res.rows.map((row: any) => new Brand(row));
        } catch (err) {
            console.error('Error finding all brands:', err);
            return null;
        }
    }

    static async delete(id: string): Promise<void> {
        if (!id) throw new Error('Cannot delete Brand without ID');

        await db.query(
            'CALL SP_DELETE_BRAND($1)', 
            [id]
        );
    }
}
