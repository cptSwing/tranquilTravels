import { useMemo, useRef } from 'preact/compat';
import { createDateString, getDaysInMonth, getFirstWeekdayIndex, wrapYear } from '../lib/handleDates';
import { wrapNumber } from '../lib/modulo';
import { DateRangePoint, DayCellData, MonthData } from '../types/types';

const useCreateCalendarMonths = (from: DateRangePoint, to: DateRangePoint) => {
    const monthCacheRef = useRef<Map<string, MonthDataTemporaryWorkingType>>(new Map());

    const monthsData_Memo: MonthData[] | undefined = useMemo(() => {
        const startingFirstWeekdayOfMonth = getFirstWeekdayIndex(from);
        const endingFirstWeekdayOfMonth = getFirstWeekdayIndex(to);

        const monthsDifference = getMonthsDifference(from, to);

        const indexOfMonthBeforeRange = wrapNumber(from.monthIndex - 1, 12);
        const yearOfMonthBeforeRange = wrapYear(from.monthIndex, from.year, -1);

        const monthsData: MonthDataTemporaryWorkingType[] = [];

        for (let i = 0; i <= monthsDifference; i++) {
            const previousMonthElement = monthsData[i - 1];

            const monthIndexIncr = wrapNumber(from.monthIndex + i, 12);
            const yearIncr = wrapYear(from.monthIndex, from.year, i);

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

            const nextMonthIndex = wrapNumber(monthIndex + 1, 12);
            const nextMonthYear = wrapYear(monthIndex, year, 1);

            // create grid dayCells for month display ('30, 31, 1, 2, ..., 31, 1, 2, 3)
            const dayCells = getDayCells({
                monthIndex,
                monthLength,
                year,
                previousMonthIndex,
                previousMonthLength,
                previousMonthYear,
                nextMonthIndex,
                nextMonthYear,
                firstWeekdayIndex,
            });

            const monthData: MonthDataTemporaryWorkingType = {
                firstWeekdayIndex,
                monthIndex,
                monthLength,
                year,
                dayCells,
            };

            monthsData.push(monthData);
            monthCacheRef.current.set(monthCacheKey, monthData);
        }

        return monthsData.map(({ year, monthIndex, dayCells }) => ({ year, monthIndex, dayCells }));
    }, [from, to]);

    return monthsData_Memo;
};

export default useCreateCalendarMonths;

// Helped by https://stackoverflow.com/a/2536445
function getMonthsDifference(from: DateRangePoint, to: DateRangePoint): number {
    let months = (to.year - from.year) * 12;
    months -= from.monthIndex;
    months += to.monthIndex;

    return months <= 0 ? 0 : months;
}

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

    const dayCells = Array.from({ length: totalCells }).map((_, idx) => {
        const monthPosition: DayCellData['monthPosition'] =
            idx < cellsBeforeMonth ? 'previousMonth' : idx >= cellsBeforeMonthPlusCellsMonths ? 'nextMonth' : 'currentMonth';

        let day, dateString;

        switch (monthPosition) {
            case 'previousMonth':
                day = previousMonthLength - (cellsBeforeMonth - idx) + 1;
                dateString = createDateString({ day, monthIndex: previousMonthIndex, year: previousMonthYear });
                break;
            case 'currentMonth':
                day = idx - cellsBeforeMonth + 1;
                dateString = createDateString({ day, monthIndex, year });

                break;
            case 'nextMonth':
                day = idx - cellsBeforeMonthPlusCellsMonths + 1;
                dateString = createDateString({ day, monthIndex: nextMonthIndex, year: nextMonthYear });

                break;
        }

        return {
            monthPosition,
            day,
            dateString,
        };
    });

    return dayCells;
}

type MonthDataTemporaryWorkingType = MonthData & {
    monthLength: number;
    firstWeekdayIndex: number;
};
