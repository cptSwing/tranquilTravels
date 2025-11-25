import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { $api } from '../lib/api';
import { CountryData, OpenHolidaysApiError } from '../types/types';
import { useMemo } from 'react';

type CountryQueryOptions = UseQueryOptions<CountryData[], OpenHolidaysApiError, CountryData[], unknown[]>;

const useQueryCountries = () => {
    const queryOption_Memo = useMemo(() => $api.queryOptions('get', '/Countries') as unknown as CountryQueryOptions, []);

    const queryResult = useQuery(queryOption_Memo);

    return queryResult;
};

export default useQueryCountries;
