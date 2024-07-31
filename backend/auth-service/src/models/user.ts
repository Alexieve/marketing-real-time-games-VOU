import { pool } from '../connection';
import { Password } from '../utils/password';

interface IUser {
    id?: number | null;
    name: string;
    email: string;
    phonenum: string;
    password: string;
    role: string;
    status: boolean;
}

class User implements IUser {
    id: number | null;
    name: string;
    email: string;
    phonenum: string;
    password: string;
    role: string;
    status: boolean;


    constructor({id, name, email, phonenum, password, role = 'Admin', status}: IUser) {
        this.id = id ?? null;
        this.name = name;
        this.email = email;
        this.phonenum = phonenum;
        this.password = password;
        this.role = role;
        this.status = status;
    }

    static async create({ name, email, phonenum, password, role = 'Admin', status }: IUser): Promise<User> {
        const hashedPassword = await Password.hash(password);
        await pool.query(
            'CALL SP_CREATE_USER($1, $2, $3, $4, $5, $6)', 
            [name, email, phonenum, hashedPassword, role, status]
        );

        const res = await pool.query(
            'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
            [email]
        );

        return new User(res.rows[0]);
    }

    static async findByEmail(email: string): Promise<User | null> {
        const res = await pool.query(
            'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
            [email]
        );
        if (res.rows.length === 0) return null;
        return new User(res.rows[0]);
    }

    static async findById(id: number): Promise<User | null> {
        const res = await pool.query(
            'SELECT * FROM FUNC_FIND_USER_BY_ID($1)',
            [id]
        );
        if (res.rows.length === 0) return null;
        return new User(res.rows[0]);
    }

    static async findAll(): Promise<User[] | null> {
        try {
            const res = await pool.query(
                'SELECT * FROM FUNC_FIND_ALL_USER()'
            );
            if (res.rows.length === 0) return null;
            return res.rows.map((row: IUser) => new User(row));
        }
        catch (err) {
            console.error(err);
            return null;
        }
        
    }

    async delete(): Promise<void> {
        if (!this.id) throw new Error('Cannot delete user without ID');

        await pool.query(
            'CALL SP_DELETE_USER($1)', 
            [this.id]
        );
    }
}

export { User, IUser };