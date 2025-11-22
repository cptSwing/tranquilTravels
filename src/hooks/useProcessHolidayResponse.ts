import { useMemo } from 'react';
import { components } from '../types/openHolidaysSchema';
import { DateRange } from '../types/types';
import { splitDateString } from '../lib/handleDates';
import isDefined from '../lib/isDefined';

const useProcessHolidayResponse = (holidaysResponse: components['schemas']['HolidayResponse'][][]) => {
    const timeRanges_Memo = useMemo(() => {
        if (holidaysResponse.length) {
            const flattened = holidaysResponse.flat().filter(isDefined);
            const sortedHolidays = flattened.sort((a, b) => a.startDate.localeCompare(b.startDate));

            const holidayNamesCache = new Map<string, HolidayGroupsAndSubdivisions>();
            const mergedRanges: DateRangeTemporaryWorkingType[] = [];

            for (let i = 0; i < sortedHolidays.length; i++) {
                const currentHoliday = sortedHolidays[i];
                const currentHolidayName = currentHoliday.name[0].text;

                // var from = new Date(2012,0,1);
                // const to = new Date(2012, 1, 20);
                // const from = new Date(splitDateString(currentRange.startDate));

                const from = currentHoliday.startDate;
                const to = new Date(currentHoliday.endDate);

                // loop for every day
                for (let day = new Date(from); day <= to; day.setDate(day.getDate() + 1)) {
                    // your day is here
                    console.log(
                        '%c[useProcessHolidayResponse]',
                        'color: #ff36d8',
                        `${currentHolidayName} --> ${currentHoliday.startDate} - ${to.toLocaleDateString('en-CA')} :`,
                        day.toLocaleDateString('en-CA'),
                    );
                }

                // TODO Accurate name per cell, not per Range
                const currentGroupName = currentHoliday.groups?.[0].shortName; // Language groups etc
                const currentSubdivisionName = currentHoliday.subdivisions?.[0].shortName; // States, Provinces etc

                const newGroupsSubdivisions: HolidayGroupsAndSubdivisions = { groups: new Set(), subdivisions: new Set() };

                if (currentGroupName) newGroupsSubdivisions.groups.add(currentGroupName);
                if (currentSubdivisionName) newGroupsSubdivisions.subdivisions.add(currentSubdivisionName);

                if (holidayNamesCache.has(currentHolidayName)) {
                    const cachedGroupsSubdivisions = holidayNamesCache.get(currentHolidayName)!;
                    newGroupsSubdivisions.groups = newGroupsSubdivisions.groups.union(cachedGroupsSubdivisions.groups);
                    newGroupsSubdivisions.subdivisions = newGroupsSubdivisions.subdivisions.union(cachedGroupsSubdivisions.subdivisions);
                }

                holidayNamesCache.set(currentHolidayName, newGroupsSubdivisions);

                const currentRange: DateRangeTemporaryWorkingType = {
                    startDate: currentHoliday.startDate,
                    endDate: currentHoliday.endDate,
                    holidayNames: new Set([currentHolidayName]),
                    groups: newGroupsSubdivisions.groups,
                    subdivisions: newGroupsSubdivisions.subdivisions,
                };

                currentRange.description = createDescription(currentRange.holidayNames!, currentRange.groups!, currentRange.subdivisions!);

                if (mergedRanges.length === 0) {
                    mergedRanges.push(currentRange);
                    continue;
                }

                const lastRange = mergedRanges[mergedRanges.length - 1];

                if (currentRange.startDate <= lastRange.endDate) {
                    lastRange.holidayNames!.add(currentHolidayName);
                    lastRange.groups = lastRange.groups!.union(newGroupsSubdivisions.groups);
                    lastRange.subdivisions = lastRange.subdivisions!.union(newGroupsSubdivisions.subdivisions);

                    lastRange.description = createDescription(lastRange.holidayNames!, lastRange.groups!, lastRange.subdivisions!);

                    // Extend the end date if necessary
                    if (currentRange.endDate > lastRange.endDate) {
                        lastRange.endDate = currentRange.endDate;
                    }
                } else {
                    // No overlap, push new rangeblock
                    mergedRanges.push(currentRange);
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
