import { useMemo } from 'react';
import { splitDateString } from '../lib/handleDates';
import { components } from '../types/openHolidaysSchema';
import { DateRange, DateType } from '../types/types';

const useProcessHolidayResponse = (
    holidaysResponse: components['schemas']['HolidayResponse'][] | undefined,
    from: DateType['dateString'],
    to: DateType['dateString'],
) => {
    const timeRanges_Memo = useMemo(() => {
        if (holidaysResponse) {
            const sorted = [...holidaysResponse].sort((a, b) => a.startDate.localeCompare(b.startDate));
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

                // Snip to user range, but do I necessarily want that?
                // const currentStripped = {
                //     startDate: current.startDate <= from ? from : current.startDate,
                //     endDate: current.endDate >= to ? to : current.endDate,
                //     name: current.name,
                // };

                const currentStripped = {
                    startDate: current.startDate,
                    endDate: current.endDate,
                    name: current.name,
                };

                if (merged.length === 0) {
                    merged.push({
                        ...currentStripped,
                        name: [
                            {
                                language: 'EN',
                                text: currentStripped.name[0].text + ' ' + currentDescriptionText,
                            },
                        ],
                    });
                    continue;
                }

                const last = merged[merged.length - 1];

                if (currentStripped.startDate <= last.endDate) {
                    last.name[0].text = `${last.name[0].text}, ${currentStripped.name[0].text} ${currentDescriptionText}`;

                    // Extend the end date if necessary
                    if (currentStripped.endDate > last.endDate) {
                        last.endDate = currentStripped.endDate;
                    }

                    // Debug stuff
                    // if (last.groups && current.groups) {
                    //     current.groups.forEach((curElem) => {
                    //         if (!last.groups!.some((lastElem) => lastElem.code === curElem.code)) {
                    //             last.groups!.push(curElem);
                    //         }
                    //     });
                    // }

                    // if (last.subdivisions && current.subdivisions) {
                    //     current.subdivisions.forEach((curElem) => {
                    //         if (!last.subdivisions!.some((lastElem) => lastElem.code === curElem.code)) {
                    //             last.subdivisions!.push(curElem);
                    //         }
                    //     });
                    // }
                } else {
                    // No overlap, push new rangeblock
                    merged.push({
                        ...currentStripped,
                        name: [
                            {
                                language: 'EN',
                                text: currentStripped.name[0].text + ' ' + currentDescriptionText,
                            },
                        ],
                    });
                }
            }

            /* Calculate blocks where no holidays */

            const free: DateRange[] = [];
            let currentDate = from;

            // for (const block of merged) {
            for (let i = 0; i < merged.length; i++) {
                const blockedRange = merged[i];

                const startDate = splitDateString(currentDate);
                const endDate = splitDateString(blockedRange.startDate);

                if (startDate && endDate) {
                    const oneDayLaterStartDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
                    const oneDayEarlierEndDateString = new Date(endDate.year, endDate.monthIndex, endDate.date - 1).toLocaleDateString('en-CA');

                    if (currentDate < blockedRange.startDate) {
                        free.push({
                            startDate: currentDate === from ? from : oneDayLaterStartDateString,
                            endDate: oneDayEarlierEndDateString,
                        });
                    }

                    currentDate = blockedRange.endDate;
                }
            }

            // gap after last block
            if (currentDate < to) {
                const startDate = splitDateString(currentDate);
                if (startDate) {
                    const startDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
                    free.push({ startDate: startDateString, endDate: to });
                }
            }

            return { merged, free };
        }
    }, [holidaysResponse, from, to]);

    return { blockedRanges: timeRanges_Memo?.merged, freeRanges: timeRanges_Memo?.free };
};

export default useProcessHolidayResponse;
