import axios from 'axios';
import { pathJoin } from './common';
import { GeneralConfig } from './types';

interface Dataset {
    id: string;
    name: string;
    description: string;
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
    region: string;
    delay: number;
    universe: string;
    coverage: number;
    valueScore: number;
    userCount: number;
    alphaCount: number;
    fieldCount: number;
    pyramidMultiplier: number;
    themes: any[];
    researchPapers: any[];
}

interface DataField {
    id: string;
    description: string;
    dataset: { id: string; name: string };
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
    region: string;
    delay: number;
    universe: string;
    type: string;
    coverage: number;
    userCount: number;
    alphaCount: number;
    pyramidMultiplier: number;
    themes: any[];
}

export async function getDatasets(
    token: string,
    config: GeneralConfig,
): Promise<Dataset[]> {
    const response = await axios.get(pathJoin('data-sets'), {
        headers: {
            Cookie: `t=${token}`,
        },
        params: {
            instrumentType: config.instrumentType,
            region: config.region,
            delay: config.delay,
            universe: config.universe,
        },
    });

    return response.data.results;
}

export async function getDataFields(
    token: string,
    datasetId: string,
    config: GeneralConfig,
    // search: string = "",
) {
    const url = pathJoin('data-fields');

    function call(offset: number) {
        return axios.get(url, {
            headers: {
                Cookie: `t=${token}`,
            },
            params: {
                instrumentType: config.instrumentType,
                region: config.region,
                delay: config.delay,
                universe: config.universe,
                'dataset.id': datasetId,
                limit: 50,
                offset,
            },
        });
    }

    const count = (await call(0)).data.count;

    const dataFieldsList: DataField[] = [];
    for (let x = 0; x < count; x += 50) {
        const response = await call(x);
        dataFieldsList.push(...response.data.results);
    }

    return dataFieldsList;
}
