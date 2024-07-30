/* eslint-disable prettier/prettier */
import axios from 'axios';
export async function request(url, method, body) {
    let data = null;
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
        });
        data = response.data;
    } catch (err) {
        throw err.response.data.errors;
    }
    return data;
};