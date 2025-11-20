import { useMemo, useRef } from 'react';
import { createDateString, getDaysInMonth, getFirstWeekdayIndex, wrapYear } from '../lib/handleDates';
import { wrapNumber } from '../lib/modulo';
import { DateRangePoint, DayCellData, MonthData } from '../types/types';

const useCreateCalendarMonths = (dateRange: { from: DateRangePoint; to: DateRangePoint }) => {
    const monthCacheRef = useRef<Map<string, MonthDataTemporaryWorkingType>>(new Map());

    const monthsData_Memo: MonthData[] | undefined = useMemo(() => {
        if (dateRange) {
            const { from, to } = dateRange;

            const startingFirstWeekdayOfMonth = getFirstWeekdayIndex(from);
            const endingFirstWeekdayOfMonth = getFirstWeekdayIndex(to);

            const monthsDifference = wrapNumber(to.monthIndex - wrapNumber(from.monthIndex, 12) + 12, 12); // WARN bugs out at 12+ months, but should suffice
            const indexOfMonthBeforeRange = wrapNumber(from.monthIndex - 1, 12);
            const yearOfMonthBeforeRange = wrapYear(from.monthIndex, from.year, indexOfMonthBeforeRange, 'backward');

            const monthsData: MonthDataTemporaryWorkingType[] = [];

            for (let i = 0; i < monthsDifference + 1; i++) {
                const previousMonthElement = monthsData[i - 1];

                const monthIndexIncr = wrapNumber(from.monthIndex + i, 12);
                const yearIncr = wrapYear(from.monthIndex, from.year, monthIndexIncr, 'forward');
                const monthCacheKey = `${yearIncr}-${monthIndexIncr + 1}`;

                // retrieve previously created month data from cache
                if (monthCacheRef.current.has(monthCacheKey)) {
                    monthsData.push(monthCacheRef.current.get(monthCacheKey)!);
                    continue;
                }

                const monthLength = getDaysInMonth(monthIndexIncr, yearIncr);

                let monthIndex, year, firstWeekdayIndex, previousMonthIndex, previousMonthLength, previousMonthYear;

                if (i === 0) {
                    // first Month
                    monthIndex = from.monthIndex;
                    year = from.year;
                    firstWeekdayIndex = startingFirstWeekdayOfMonth;
                    previousMonthIndex = indexOfMonthBeforeRange;
                    previousMonthLength = getDaysInMonth(indexOfMonthBeforeRange, yearOfMonthBeforeRange);
                    previousMonthYear = yearOfMonthBeforeRange;
                } else if (i === monthsDifference) {
                    // last Month
                    monthIndex = to.monthIndex;
                    year = to.year;
                    firstWeekdayIndex = endingFirstWeekdayOfMonth;
                    previousMonthIndex = previousMonthElement.monthIndex;
                    previousMonthLength = previousMonthElement.monthLength;
                    previousMonthYear = previousMonthElement.year;
                } else {
                    // in-between
                    monthIndex = monthIndexIncr;
                    year = yearIncr;
                    firstWeekdayIndex = wrapNumber(previousMonthElement.firstWeekdayIndex + previousMonthElement.monthLength, 7); // avoid further Date() object creation
                    previousMonthIndex = previousMonthElement.monthIndex;
                    previousMonthLength = previousMonthElement.monthLength;
                    previousMonthYear = previousMonthElement.year;
                }

                // create grid cells for month display ('30, 31, 1, 2, ..., 31, 1, 2, 3)
                const cells = getDayCells({
                    monthIndex,
                    monthLength,
                    year,
                    previousMonthIndex,
                    previousMonthLength,
                    previousMonthYear,
                    nextMonthIndex: wrapNumber(monthIndex + 1, 12),
                    nextMonthYear: wrapYear(monthIndex, year, wrapNumber(monthIndex + 1, 12), 'forward'),
                    firstWeekdayIndex,
                });

                const monthData: MonthDataTemporaryWorkingType = {
                    firstWeekdayIndex,
                    monthIndex,
                    monthLength,
                    year,
                    cells,
                };

                monthsData.push(monthData);
                monthCacheRef.current.set(monthCacheKey, monthData);
            }

            return monthsData.map(({ year, monthIndex, cells }) => ({ year, monthIndex, cells })) as MonthData[];
        }
    }, [dateRange]);

    return monthsData_Memo;
};

export default useCreateCalendarMonths;

function getDayCells({
    monthIndex,
    monthLength,
    year,
    firstWeekdayIndex,
    previousMonthIndex,
    previousMonthLength,
    previousMonthYear,
    nextMonthIndex,
    nextMonthYear,
}: {
    monthIndex: number;
    monthLength: number;
    year: number;
    firstWeekdayIndex: number;
    previousMonthIndex: number;
    previousMonthLength: number;
    previousMonthYear: number;
    nextMonthIndex: number;
    nextMonthYear: number;
}): DayCellData[] {
    const cellsBeforeMonth = firstWeekdayIndex;
    const cellsMonth = monthLength;
    const cellsBeforeMonthPlusCellsMonths = cellsBeforeMonth + cellsMonth;
    const cellsAfterMonth = (7 - (cellsBeforeMonthPlusCellsMonths % 7)) % 7;
    const totalCells = cellsBeforeMonthPlusCellsMonths + cellsAfterMonth;

    const cells = Array.from({ length: totalCells }).map((_, idx) => {
        const monthPosition: DayCellData['monthPosition'] =
            idx < cellsBeforeMonth ? 'previousMonth' : idx >= cellsBeforeMonthPlusCellsMonths ? 'nextMonth' : 'currentMonth';

        let date, dateString;

        switch (monthPosition) {
            case 'previousMonth':
                date = previousMonthLength - (cellsBeforeMonth - idx) + 1;
                dateString = createDateString({ date, monthIndex: previousMonthIndex, year: previousMonthYear });
                break;
            case 'currentMonth':
                date = idx - cellsBeforeMonth + 1;
                dateString = createDateString({ date, monthIndex, year });

                break;
            case 'nextMonth':
                date = idx - cellsBeforeMonthPlusCellsMonths + 1;
                dateString = createDateString({ date, monthIndex: nextMonthIndex, year: nextMonthYear });

                break;
        }

        return {
            monthPosition,
            date,
            dateString,
        };
    });

    return cells;
}

type MonthDataTemporaryWorkingType = MonthData & {
    monthLength: number;
    firstWeekdayIndex: number;
};
