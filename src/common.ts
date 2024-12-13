import { AxiosResponse } from 'axios';
import path from 'path';

const BASE_URL = 'https://api.worldquantbrain.com';

export function pathJoin(relativePath: string) {
    return path.join(BASE_URL, relativePath);
}

export function parseCookie(response: AxiosResponse, name: string) {
    const cookies = response.headers['set-cookie'];
    if (!cookies) {
        throw new Error('No cookies');
    }

    const cookie = cookies.find((c: string) => c.startsWith(`${name}=`));
    if (!cookie) {
        throw new Error(`No ${name} cookie`);
    }

    // parse the cookie
    const cookieParts = cookie.split(';');
    return cookieParts[0].split('=')[1];
}
