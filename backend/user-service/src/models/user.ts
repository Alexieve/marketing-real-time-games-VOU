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
    avatar?: {
        src: string;
        status: string;
    };
    new?: boolean;
    registered?: string;
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
    new?: boolean;
    registered?: string;

    constructor({id, name, email, phonenum, password, role = 'Admin', status, avatar, new: isNew, registered}: IUser) {
        this.id = id ?? null;
        this.name = name;
        this.email = email;
        this.phonenum = phonenum;
        this.password = password;
        this.role = role;
        this.status = status;
        this.avatar = avatar;
        this.new = isNew;
        this.registered = registered;
    }

    static async findAllUser(): Promise<User[] | null> {
        try {
            const res = await pool.query(
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
                new: row.new || false,
                registered: row.registered || 'Jan 1, 2023' // Replace this with actual date logic
            }));
            
            return users;
        } catch (err) {
            console.error('Error finding all users:', err);
            return null;
        }
    }
}    
export { User, IUser };
