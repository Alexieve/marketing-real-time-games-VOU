import axios from 'axios';
import localhost from '../url.config';

export async function request(
    url: string, 
    method: string, 
    body: any = null, 
) {
    let data = null;
    try {
        // console.log("Requesting...", localhost + url);
        // console.log("Method: ", method);
        // console.log("Body: ", body);
        const response = await axios({
            method: method,
            url: localhost + url,
            data: body,
        });
        data = response.data;
    } catch (err: any) {
        // console.error("Error from request Utils: ", err.request.message);
        throw err.response ? err.response.data.errors : err;
    }
    return data;
};
