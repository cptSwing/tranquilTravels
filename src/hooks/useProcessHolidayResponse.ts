import { useMemo } from 'react';
import { components } from '../types/openHolidaysSchema';

const useProcessHolidayResponse = (holidaysResponse: components['schemas']['HolidayResponse'][] | undefined) => {
    const timeRanges_Memo = useMemo(() => {
        if (holidaysResponse) {
            const sorted = [...holidaysResponse].sort((a, b) => a.startDate.localeCompare(b.startDate));
            const merged: {
                description: string;
                startDate: components['schemas']['HolidayResponse']['startDate'];
                endDate: components['schemas']['HolidayResponse']['endDate'];
            }[] = [];

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

                const currentStripped = {
                    startDate: current.startDate,
                    endDate: current.endDate,
                    description: current.name[0].text,
                };

                if (merged.length === 0) {
                    merged.push({
                        ...currentStripped,
                        description: currentStripped.description + ' ' + currentDescriptionText,
                    });
                    continue;
                }

                const last = merged[merged.length - 1];

                if (currentStripped.startDate <= last.endDate) {
                    last.description = `${last.description}, ${currentStripped.description} ${currentDescriptionText}`;

                    // Extend the end date if necessary
                    if (currentStripped.endDate > last.endDate) {
                        last.endDate = currentStripped.endDate;
                    }
                } else {
                    // No overlap, push new rangeblock
                    merged.push({
                        ...currentStripped,
                        description: currentStripped.description + ' ' + currentDescriptionText,
                    });
                }
            }

            // /* Calculate blocks where no holidays */
            // const free: DateRange[] = [];
            // let currentDate = from;

            // // for (const block of merged) {
            // for (let i = 0; i < merged.length; i++) {
            //     const blockedRange = merged[i];

            //     const startDate = splitDateString(currentDate);
            //     const endDate = splitDateString(blockedRange.startDate);

            //     if (startDate && endDate) {
            //         const oneDayLaterStartDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
            //         const oneDayEarlierEndDateString = new Date(endDate.year, endDate.monthIndex, endDate.date - 1).toLocaleDateString('en-CA');

            //         if (currentDate < blockedRange.startDate) {
            //             free.push({
            //                 startDate: currentDate === from ? from : oneDayLaterStartDateString,
            //                 endDate: oneDayEarlierEndDateString,
            //             });
            //         }

            //         currentDate = blockedRange.endDate;
            //     }
            // }

            // // gap after last block
            // if (currentDate < to) {
            //     const startDate = splitDateString(currentDate);
            //     if (startDate) {
            //         const startDateString = new Date(startDate.year, startDate.monthIndex, startDate.date + 1).toLocaleDateString('en-CA');
            //         free.push({ startDate: startDateString, endDate: to });
            //     }
            // }

            return merged;
        }
    }, [holidaysResponse]);

    return { blockedRanges: timeRanges_Memo };
};

export default useProcessHolidayResponse;
