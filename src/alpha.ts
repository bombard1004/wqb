import axios from 'axios';
import { pathJoin } from './common';

export async function getAlpha(alphaId: string, token: string) {
    const response = await axios.get(pathJoin(`alphas/${alphaId}`), {
        headers: {
            Cookie: `t=${token}`,
        },
    });

    return response.data;
}
