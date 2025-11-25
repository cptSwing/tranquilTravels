import { $api } from '../lib/api';
import { QueriesResults, useQueries, UseQueryOptions } from '@tanstack/react-query';
import isDefined from '../lib/isDefined';
import { useCallback, useMemo } from 'react';
import config from '../config/config.json';
import { useZustandStore } from '../lib/zustandStore';
import { HolidayData, HolidayDataByCountry, OpenHolidaysApiError } from '../types/types';

type HolidayQueryOptions = UseQueryOptions<HolidayData[], OpenHolidaysApiError, HolidayData[], unknown[]>;

const useQueryHolidaysByCountries = (from: string, to: string) => {
    const selectedCountries = useZustandStore((s) => s.values.countries);

    const queryOptions_Memo = useMemo(
        () =>
            selectedCountries.map(
                (countryItem) =>
                    $api.queryOptions('get', '/SchoolHolidays', {
                        params: {
                            query: {
                                countryIsoCode: countryItem.value,
                                validFrom: from, // TODO should be from beginning of month (or rather, beginning of calenderview)
                                validTo: to, // TODO should be to end of month (or rather, end of calenderview)
                                languageIsoCode: config.language,
                            },
                        },
                    }) as unknown as HolidayQueryOptions,
            ),
        [from, selectedCountries, to],
    );

    const combineResults_Cb = useCallback(
        (results: QueriesResults<HolidayQueryOptions[]>) => ({
            data: results
                // .map((r) => r.data)
                .map((r, idx) =>
                    r.data?.map((rD) => {
                        const rDByCountry = rD as HolidayDataByCountry;
                        rDByCountry.countryItem = selectedCountries[idx];
                        return rDByCountry;
                    }),
                )
                .filter(isDefined),
            isPending: results.some((r) => r.isPending),
            errors: results.map((r) => r.error).filter(isDefined),
        }),
        [selectedCountries],
    );

    const combinedQueries = useQueries({
        queries: queryOptions_Memo,
        combine: combineResults_Cb,
    });

    return combinedQueries;
};

export default useQueryHolidaysByCountries;
