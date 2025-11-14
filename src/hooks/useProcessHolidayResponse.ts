import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';
import { useMemo } from 'react';
import { getDateString, splitDateString } from '../lib/handleDates';

const useProcessHolidayResponse = (holidayType: 'public' | 'school') => {
    const selectedCountries = useZustandStore((store) => store.values.countries);
    const { from, to } = useZustandStore((store) => store.values.dateRange);
    const fromDateString = getDateString(from);
    const toDateString = getDateString(to);

    const { data, error, isLoading } = $api.useQuery(
        'get',
        holidayType === 'school' ? '/SchoolHolidays' : '/PublicHolidays',
        {
            params: {
                query: {
                    countryIsoCode: selectedCountries[0],
                    validFrom: fromDateString,
                    validTo: toDateString,
                    languageIsoCode: config.language,
                },
            },
        },
        {
            enabled: isDefined(selectedCountries[0]),
        },
    );

    const timeRanges_Memo = useMemo(() => {
        if (data) {
            const sorted = [...data].sort((a, b) => a.startDate.localeCompare(b.startDate));

            const merged = [];

            for (let i = 0; i < sorted.length; i++) {
                const current = sorted[i];

                const currentGroupShortName = current.groups?.[0].shortName;
                const currentSubdivisionShortName = current.subdivisions?.[0].shortName;

                const currentDescriptionText =
                    currentSubdivisionShortName && currentGroupShortName
                        ? `(${currentSubdivisionShortName} ${currentGroupShortName})`
                        : currentGroupShortName
                          ? `(${currentGroupShortName})`
                          : currentSubdivisionShortName
                            ? `(${currentSubdivisionShortName})`
                            : // neither:
                              '';

                if (merged.length === 0) {
                    merged.push({
                        ...current,
                        name: [
                            {
                                language: 'EN',
                                text: current.name[0].text + ' ' + currentDescriptionText,
                            },
                        ],
                    });
                    continue;
                }

                const last = merged[merged.length - 1];

                // check overlap: current.start <= last.end
                if (current.startDate <= last.endDate) {
                    // Extend the end date if necessary

                    last.name[0].text = `${last.name[0].text}, ${current.name[0].text} ${currentDescriptionText}`;
                    if (last.groups && current.groups) {
                        current.groups.forEach((curElem) => {
                            if (!last.groups!.some((lastElem) => lastElem.code === curElem.code)) {
                                last.groups!.push(curElem);
                            }
                        });
                    }

                    if (last.subdivisions && current.subdivisions) {
                        current.subdivisions.forEach((curElem) => {
                            if (!last.subdivisions!.some((lastElem) => lastElem.code === curElem.code)) {
                                last.subdivisions!.push(curElem);
                            }
                        });
                    }

                    if (current.endDate > last.endDate) {
                        last.endDate = current.endDate;
                    }
                } else {
                    // No overlap, push new rangeblock
                    merged.push({
                        ...current,
                        name: [
                            {
                                language: 'EN',
                                text: current.name[0].text + ' ' + currentDescriptionText,
                            },
                        ],
                    });
                }
            }

            const free = [];

            let current = fromDateString;

            // for (const block of merged) {
            for (let i = 0; i < merged.length; i++) {
                const blockedRange = merged[i];

                const startDate = splitDateString(current);
                const oneDayLaterStartDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');

                const endDate = splitDateString(blockedRange.startDate);
                const oneDayEarlierEndDateString = new Date(endDate.year, endDate.monthIndex, endDate.date - 1).toLocaleDateString('en-CA');

                if (current < blockedRange.startDate) {
                    free.push({ startDate: current === fromDateString ? fromDateString : oneDayLaterStartDateString, endDate: oneDayEarlierEndDateString });
                }

                current = blockedRange.endDate;
            }

            // gap after last block
            if (current < toDateString) {
                const startDate = splitDateString(current);
                const startDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
                free.push({ startDate: startDateString, endDate: toDateString });
            }

            return { merged, free };
        }
    }, [data, fromDateString, toDateString]);

    return { data, blockedRanges: timeRanges_Memo?.merged, freeRanges: timeRanges_Memo?.free, error, isLoading };
};

export default useProcessHolidayResponse;
