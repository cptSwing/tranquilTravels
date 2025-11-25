import { useMemo } from 'react';
import { ComboboxItem, DateRange, HolidayDataByCountry, RangeDays } from '../types/types';
import { splitDateString } from '../lib/handleDates';
import isDefined from '../lib/isDefined';

const useProcessHolidayResponse = (holidaysResponse: HolidayDataByCountry[][]) => {
    const timeRanges_Memo = useMemo(() => {
        if (holidaysResponse.length) {
            const flattened = holidaysResponse.flat().filter(isDefined);
            const sortedHolidays = flattened.sort((a, b) => a.startDate.localeCompare(b.startDate));

            const mergedRanges: DateRange[] = [];
            const rangeDays: RangeDays = new Map();

            for (let i = 0; i < sortedHolidays.length; i++) {
                const currentHoliday = sortedHolidays[i];
                const currentHolidayName = currentHoliday.name[0].text.toLowerCase();
                const currentHolidayCountry = currentHoliday.countryItem;

                const currentGroupName = currentHoliday.groups?.[0].shortName; // Language groups etc
                const currentSubdivisionName = currentHoliday.subdivisions?.[0].shortName; // States, Provinces etc

                const dailyDescriptions = getDailyDescriptions(
                    currentHoliday.startDate,
                    currentHoliday.endDate,
                    rangeDays,
                    currentHolidayCountry,
                    currentHolidayName,
                    currentGroupName,
                    currentSubdivisionName,
                );

                const currentRange: DateRange = {
                    startDate: currentHoliday.startDate,
                    endDate: currentHoliday.endDate,
                    dailyDescriptions,
                };

                if (mergedRanges.length === 0) {
                    mergedRanges.push(currentRange);
                    continue;
                }

                const lastRange = mergedRanges[mergedRanges.length - 1];

                if (currentRange.startDate <= lastRange.endDate) {
                    // Extend the end date if necessary
                    if (currentRange.endDate > lastRange.endDate) {
                        lastRange.endDate = currentRange.endDate;
                    }
                } else {
                    // No overlap, push new rangeblock
                    mergedRanges.push(currentRange);
                }
            }

            const filteredRanges = mergedRanges.map(({ startDate, endDate, dailyDescriptions }) => ({ startDate, endDate, dailyDescriptions }) as DateRange);
            return filteredRanges;
        }
    }, [holidaysResponse]);

    return { blockedRanges: timeRanges_Memo };
};

export default useProcessHolidayResponse;

function getDailyDescriptions(
    startDate: string,
    endDate: string,
    daysMap: RangeDays,
    holidayCountry: ComboboxItem,
    holidayName: string,
    groupName?: string,
    subdivisionName?: string,
) {
    const from = startDate;
    const to = new Date(endDate);
    const { value: countryIsoCode } = holidayCountry;

    // loop for every day
    for (let dayDate = new Date(from); dayDate <= to; dayDate.setUTCDate(dayDate.getUTCDate() + 1)) {
        const dateString = dayDate.toLocaleDateString('en-CA');

        const singleDayMap = daysMap.has(dateString) ? daysMap.get(dateString)! : daysMap.set(dateString, new Map()).get(dateString)!;

        if (singleDayMap.has(countryIsoCode)) {
            const countryMap = singleDayMap.get(countryIsoCode)!;

            let newGroups: Set<string>, newSubdivisions: Set<string>;
            if (countryMap.has(holidayName)) {
                const { groups, subdivisions } = countryMap.get(holidayName)!;
                newGroups = groupName ? groups.add(groupName) : groups;
                newSubdivisions = subdivisionName ? groups.add(subdivisionName) : subdivisions;
            } else {
                newGroups = groupName ? new Set([groupName]) : new Set();
                newSubdivisions = subdivisionName ? new Set([subdivisionName]) : new Set();
            }

            countryMap.set(holidayName, {
                groups: newGroups,
                subdivisions: newSubdivisions,
            });
        } else {
            singleDayMap.set(
                countryIsoCode,
                new Map().set(holidayName, {
                    groups: groupName ? new Set([groupName]) : new Set(),
                    subdivisions: subdivisionName ? new Set([subdivisionName]) : new Set(),
                }),
            );
        }
    }

    return daysMap;
}

function _getFreeDateRanges(startDateString: string, endDateString: string, blockedRanges: DateRange[]) {
    const ranges: DateRange[] = [];
    let currentDate = startDateString;

    // for (const block of merged) {
    for (let i = 0; i < blockedRanges.length; i++) {
        const blockedRange = blockedRanges[i];

        const startDate = splitDateString(currentDate);
        const endDate = splitDateString(blockedRange.startDate);

        if (startDate && endDate) {
            const oneDayLaterStartDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
            const oneDayEarlierEndDateString = new Date(endDate.year, endDate.monthIndex, endDate.date - 1).toLocaleDateString('en-CA');

            if (currentDate < blockedRange.startDate) {
                ranges.push({
                    startDate: currentDate === startDateString ? startDateString : oneDayLaterStartDateString,
                    endDate: oneDayEarlierEndDateString,
                });
            }

            currentDate = blockedRange.endDate;
        }
    }

    // gap after last block
    if (currentDate < endDateString) {
        const startDate = splitDateString(currentDate);
        if (startDate) {
            const startDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
            ranges.push({ startDate: startDateString, endDate: endDateString });
        }
    }

    return ranges;
}
