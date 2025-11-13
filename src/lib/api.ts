import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { paths, components } from '../types/openHolidaysSchema';
import { QueryClient } from '@tanstack/react-query';

const fetchClient = createFetchClient<paths>({
    baseUrl: 'https://openholidaysapi.org',
});

export const $api = createClient(fetchClient);

export const queryClientTanstack = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
