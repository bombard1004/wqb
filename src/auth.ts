import axios from 'axios';
import { parseCookie, pathJoin } from './common';

export async function login(
    email: string,
    password: string,
): Promise<
    { token: string } | { biometric: { url: string; inquiry: string } }
> {
    const base64 = Buffer.from(`${email}:${password}`).toString('base64');

    try {
        const response = await axios.post(
            pathJoin('authentication'),
            {},
            {
                headers: {
                    Authorization: `Basic ${base64}`,
                },
            },
        );

        const token = parseCookie(response, 't');
        return { token };
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 401
        ) {
            const headers = error.response.headers;
            if (headers['www-authenticate'] === 'persona') {
                const location = headers['location'];
                if (typeof location === 'string') {
                    const url = pathJoin(location);
                    const inquiry = location.split('inquiry=')[1];
                    return { biometric: { url, inquiry } };
                }
            }

            throw error;
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
}

export async function biometricLogin(inquiry: string) {
    const response = await axios.post(pathJoin('authentication/persona'), {
        inquiry,
    });

    const token = parseCookie(response, 't');
    return { token };
}
