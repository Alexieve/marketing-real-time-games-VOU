import bcrypt from 'bcryptjs';

class Password {
    private static saltRounds: number = 10;

    static async hash(password: string): Promise<string> {
        //return bcrypt.hash(password, Password.saltRounds);
        return password;
    }

    static async compare(password: string, hashedPassword: string): Promise<boolean> {
        //return bcrypt.compare(password, hashedPassword);
        if ( password == hashedPassword) return true;
        return false;
    }
}

export  {Password};
