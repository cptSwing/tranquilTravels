import { useMemo } from 'react';
import { getDateString, getDaysInMonth, getFirstWeekdayIndex, wrapYear } from '../lib/handleDates';
import { wrapNumber } from '../lib/modulo';
import { DateRangePoint, DayCellData, MonthData } from '../types/types';

const useCreateCalendarMonths = (dateRange: { from: DateRangePoint; to: DateRangePoint }) => {
    const monthsData: MonthData[] | undefined = useMemo(() => {
        if (dateRange) {
            const { from, to } = dateRange;

            const startingFirstWeekdayOfMonth = getFirstWeekdayIndex(from);
            const endingFirstWeekdayOfMonth = getFirstWeekdayIndex(to);

            const monthsDifference = wrapNumber(to.monthIndex - wrapNumber(from.monthIndex, 12) + 12, 12); // WARN bugs out at 12+ months, but should suffice
            const indexOfMonthBeforeRange = wrapNumber(from.monthIndex - 1, 12);
            const yearOfMonthBeforeRange = wrapYear(from.monthIndex, from.year, indexOfMonthBeforeRange, 'backward');

            const months: MonthData[] = [];

            for (let i = 0; i < monthsDifference + 1; i++) {
                const previousMonthElement = months[i - 1];

                const monthStep = wrapNumber(from.monthIndex + i, 12);
                const yearStep = wrapYear(from.monthIndex, from.year, monthStep, 'forward');
                const monthLength = getDaysInMonth(monthStep, yearStep);

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
                    monthIndex = monthStep;
                    year = yearStep;
                    firstWeekdayIndex = wrapNumber(previousMonthElement.firstWeekdayIndex + previousMonthElement.monthLength, 7);
                    previousMonthIndex = previousMonthElement.monthIndex;
                    previousMonthLength = previousMonthElement.monthLength;
                    previousMonthYear = previousMonthElement.year;
                }

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

                months.push({
                    monthIndex,
                    year,
                    monthLength,
                    firstWeekdayIndex,
                    cells,
                });
            }

            return months;
        }
    }, [dateRange]);

    return monthsData;
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
                dateString = getDateString({ date, monthIndex: previousMonthIndex, year: previousMonthYear });
                break;
            case 'currentMonth':
                date = idx - cellsBeforeMonth + 1;
                dateString = getDateString({ date, monthIndex, year });

                break;
            case 'nextMonth':
                date = idx - cellsBeforeMonthPlusCellsMonths + 1;
                dateString = getDateString({ date, monthIndex: nextMonthIndex, year: nextMonthYear });

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
