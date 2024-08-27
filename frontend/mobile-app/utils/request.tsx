import axios from 'axios';
import localhost from '../url.config';

export async function request(
    url: string, 
    method: string, 
    body: any = null, 
    token: string | null = null
) {
    let data = null;
    try {
        const response = await axios({
            method: method,
            url: localhost + url,
            data: body,
        });
        data = response.data;
    } catch (err: any) {
        throw err.response ? err.response.data.errors : err;
    }
    return data;
};
