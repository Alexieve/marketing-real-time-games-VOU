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

    static async createCustomer({ name, email, phonenum, password, status, gender}
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

    static async findByEmail(email: string): Promise<Customer | null> {
        try {
            const customer = await db.query(
                'SELECT * FROM FUNC_FIND_CUSTOMER_BY_EMAIL($1)',
                [email]
            );
            if (customer.rows.length === 0) return null
            return new Customer(customer.rows[0]);
        } catch (error) {
            console.error('Error finding brand by email:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<User | null> {
        const customer = await db.query(
            'SELECT * FROM FUNC_FIND_CUSTOMER_BY_ID($1)',
            [id]
        );
        if (customer.rows.length === 0) return null
        return new Customer(customer.rows[0]);
    }

    static async findAll(): Promise<User[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_FIND_ALL_CUSTOMER()'
            );
            if (res.rows.length === 0) return null;
            return res.rows.map((row: any) => new Customer(row));
        } catch (err) {
            console.error('Error finding all customers:', err);
            return null;
        }
    }

    async delete(): Promise<void> {
        if (!this.id) throw new Error('Cannot delete Customer without ID');

        await db.query(
            'SELECT * FROM FUNC_DELETE_CUSTOMER($1)', 
            [this.id]
        );
    }
}
