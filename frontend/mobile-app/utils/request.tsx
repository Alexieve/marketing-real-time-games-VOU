import axios from 'axios';
export async function request(url: string, method: string, body: any) {
    let data = null;
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
        });
        data = response.data;
    } catch (err: any) {
        console.log('Error:', err);
        throw err.response.data.errors;
    }
    return data;
};