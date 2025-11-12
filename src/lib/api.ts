import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { paths, components } from '../types/openHolidaysSchema';

const fetchClient = createFetchClient<paths>({
    baseUrl: 'https://openholidaysapi.org',
});

export const $api = createClient(fetchClient);
