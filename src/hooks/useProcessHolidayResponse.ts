import { useMemo } from 'react';
import { components } from '../types/openHolidaysSchema';
import { DateRange } from '../types/types';
import { splitDateString } from '../lib/handleDates';

const useProcessHolidayResponse = (holidaysResponse: components['schemas']['HolidayResponse'][] | undefined) => {
    const timeRanges_Memo = useMemo(() => {
        if (holidaysResponse) {
            const sortedHolidays = [...holidaysResponse].sort((a, b) => a.startDate.localeCompare(b.startDate));
            const mergedRanges: DateRangeTemporaryWorkingType[] = [];
            const holidayNamesCache = new Map<string, HolidayGroupsAndSubdivisions>();

            for (let i = 0; i < sortedHolidays.length; i++) {
                const currentHoliday = sortedHolidays[i];
                const currentHolidayName = currentHoliday.name[0].text;

                // TODO Accurate name per cell, not per Range
                const currentGroupShortName = currentHoliday.groups?.[0].shortName; // Language groups etc
                const currentSubdivisionShortName = currentHoliday.subdivisions?.[0].shortName; // States, Provinces etc

                const newHolidayGroupsSubdivisions: HolidayGroupsAndSubdivisions = { groups: new Set(), subdivisions: new Set() };

                if (currentGroupShortName) newHolidayGroupsSubdivisions.groups.add(currentGroupShortName);
                if (currentSubdivisionShortName) newHolidayGroupsSubdivisions.subdivisions.add(currentSubdivisionShortName);

                if (holidayNamesCache.has(currentHolidayName)) {
                    const cachedHolidayGroupsSubdivisions = holidayNamesCache.get(currentHolidayName)!;
                    newHolidayGroupsSubdivisions.groups = newHolidayGroupsSubdivisions.groups.union(cachedHolidayGroupsSubdivisions.groups);
                    newHolidayGroupsSubdivisions.subdivisions = newHolidayGroupsSubdivisions.subdivisions.union(cachedHolidayGroupsSubdivisions.subdivisions);
                }

                holidayNamesCache.set(currentHolidayName, newHolidayGroupsSubdivisions);

                const currentHolidayRange: DateRangeTemporaryWorkingType = {
                    startDate: currentHoliday.startDate,
                    endDate: currentHoliday.endDate,
                    holidayNames: new Set([currentHolidayName]),
                    groups: newHolidayGroupsSubdivisions.groups,
                    subdivisions: newHolidayGroupsSubdivisions.subdivisions,
                };

                currentHolidayRange.description = createDescription(
                    currentHolidayRange.holidayNames!,
                    currentHolidayRange.groups!,
                    currentHolidayRange.subdivisions!,
                );

                if (mergedRanges.length === 0) {
                    mergedRanges.push(currentHolidayRange);
                    continue;
                }

                const lastRange = mergedRanges[mergedRanges.length - 1];

                if (currentHolidayRange.startDate <= lastRange.endDate) {
                    lastRange.holidayNames!.add(currentHolidayName);
                    lastRange.groups = lastRange.groups!.union(newHolidayGroupsSubdivisions.groups);
                    lastRange.subdivisions = lastRange.subdivisions!.union(newHolidayGroupsSubdivisions.subdivisions);

                    lastRange.description = createDescription(lastRange.holidayNames!, lastRange.groups!, lastRange.subdivisions!);

                    // Extend the end date if necessary
                    if (currentHolidayRange.endDate > lastRange.endDate) {
                        lastRange.endDate = currentHolidayRange.endDate;
                    }
                } else {
                    // No overlap, push new rangeblock
                    mergedRanges.push(currentHolidayRange);
                }
            }

            return mergedRanges.map(({ startDate, endDate, description }) => ({ startDate, endDate, description })) as DateRange[];
        }
    }, [holidaysResponse]);

    return { blockedRanges: timeRanges_Memo };
};

export default useProcessHolidayResponse;

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

function createDescription(names: Set<string>, groups: Set<string>, subdivisions: Set<string>) {
    const nameString = [...names].join('/');
    const groupsString = [...groups].join(', ');
    const subdivisionsString = [...subdivisions].join(', ');

    return `${nameString} ${groupsString ? `(${groupsString})` : ''} ${subdivisionsString ? ` (${subdivisionsString})` : ''} `;
}

type DateRangeTemporaryWorkingType = DateRange & {
    holidayNames?: Set<string>;
    groups?: Set<string>;
    subdivisions?: Set<string>;
};

type HolidayGroupsAndSubdivisions = { groups: Set<string>; subdivisions: Set<string> };
