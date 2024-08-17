import db from '../connection';
import { Password } from '@vmquynh-vou/shared';

interface IUser {
    id?: number | null;
    name: string;
    email: string;
    phonenum: string;
    password: string;
    role: string;
    status: boolean;
    avatar?: {
        src: string;
        status: string;
    };
}


class User implements IUser {
    id: number | null;
    name: string;
    email: string;
    phonenum: string;
    password: string;
    role: string;
    status: boolean;
    avatar?: {
        src: string;
        status: string;
    };

    constructor({id, name, email, phonenum, password, role = 'Admin', status, avatar}: IUser) {
        this.id = id ?? null;
        this.name = name;
        this.email = email;
        this.phonenum = phonenum;
        this.password = password;
        this.role = role;
        this.status = status;
        this.avatar = avatar;
    }

    static async create({ name, email, phonenum, password, role = 'Admin', status }: IUser): Promise<User> {
        try {
            const hashedPassword = await Password.hash(password);
            await db.query(
                'CALL SP_CREATE_USER($1, $2, $3, $4, $5, $6)', 
                [name, email, phonenum, hashedPassword, role, status]
            );

            const res = await this.findByEmail(email);
            if (!res) {
                throw new Error('Cannot find user after create!');
            }
            return res;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_FIND_USER_BY_EMAIL($1)',
                [email]
            );
            if (res.rows.length === 0) return null;
            return new User(res.rows[0]);
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<User | null> {
        const res = await db.query(
            'SELECT * FROM FUNC_FIND_USER_BY_ID($1)',
            [id]
        );
        if (res.rows.length === 0) return null;
        return new User(res.rows[0]);
    }

    static async findAllUser(): Promise<User[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_FIND_ALL_USER()'
            );            
            if (res.rows.length === 0) return null;
            const users = res.rows.map((row: any) => new User({
                id: row.id,
                name: row.name,
                email: row.email,
                phonenum: row.phonenum,
                password: row.password, // Make sure to handle this securely
                role: row.role,
                status: row.status,
                avatar: {
                    src: 'avatar1', // Replace this with actual avatar logic
                    status: 'success' // Replace this with actual status logic
                },
            }));
            
            return users;
        } catch (err) {
            console.error('Error finding all users:', err);
            return null;
        }
    }

    async delete(): Promise<void> {
        if (!this.id) throw new Error('Cannot delete user without ID');

        await db.query(
            'CALL SP_DELETE_USER($1)', 
            [this.id]
        );
    }
}    
export { User, IUser };
