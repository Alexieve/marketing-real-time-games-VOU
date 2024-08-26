import axios from 'axios';
export async function request(url: string, method: string, body: any = null, token: string | null = null) {
    let data = null;
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        data = response.data;
    } catch (err: any) {
        console.log('Error:', err);
        throw err.response.data.errors;
    }
    return data;
};