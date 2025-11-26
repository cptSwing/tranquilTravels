import { $api } from '../lib/api';
import { QueriesResults, useQueries, UseQueryOptions } from '@tanstack/react-query';
import isDefined from '../lib/isDefined';
import { useCallback, useMemo } from 'react';
import config from '../config/config.json';
import { useZustandStore } from '../lib/zustandStore';
import { HolidayData, HolidayDataByCountry, OpenHolidaysApiError } from '../types/types';

type HolidayQueryOptions = UseQueryOptions<HolidayData[], OpenHolidaysApiError, HolidayData[], unknown[]>;

const useQueryHolidaysByCountries = (from: string, to: string) => {
    const selectedHolidayTypes = useZustandStore((s) => s.values.holidayType);
    const selectedCountries = useZustandStore((s) => s.values.countries);

    const { queryOptions, metaDatas } = useMemo(() => {
        const metaDatas: HolidayDataByCountry['metaData'][] = [];

        const queryOptions = Object.entries(selectedHolidayTypes)
            .filter(([_, isSelected]) => isSelected)
            .flatMap(([holidayType]) =>
                selectedCountries.map((countryItem) => {
                    metaDatas.push({
                        countryItem,
                        holidayType: holidayType as 'schoolHoliday' | 'publicHoliday',
                    });
                    return $api.queryOptions('get', holidayType === 'schoolHoliday' ? '/SchoolHolidays' : '/PublicHolidays', {
                        params: {
                            query: {
                                countryIsoCode: countryItem.value,
                                validFrom: from, // TODO should be from beginning of month (or rather, beginning of calenderview)
                                validTo: to, // TODO should be to end of month (or rather, end of calenderview)
                                languageIsoCode: config.language,
                            },
                        },
                    }) as unknown as HolidayQueryOptions;
                }),
            )
            .filter(isDefined);

        return { queryOptions, metaDatas };
    }, [from, selectedCountries, selectedHolidayTypes, to]);

    const combineResults_Cb = useCallback(
        (results: QueriesResults<HolidayQueryOptions[]>) => ({
            data: results
                .map((result, idx) => {
                    return result.data?.map((holidayData) => {
                        const holidayDataByCountry = holidayData as HolidayDataByCountry;
                        holidayDataByCountry.metaData = { ...metaDatas[idx] };

                        return holidayDataByCountry;
                    });
                })
                .filter(isDefined),
            isPending: results.some((r) => r.isPending),
            errors: results.map((r) => r.error).filter(isDefined),
        }),
        [metaDatas],
    );

    const combinedResults = useQueries({
        queries: queryOptions,
        combine: combineResults_Cb,
    });

    return combinedResults;
};

export default useQueryHolidaysByCountries;
