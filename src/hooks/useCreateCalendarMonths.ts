import { useMemo } from 'react';
import { getDaysInMonth } from '../lib/handleDates';
import { wrapNumber } from '../lib/modulo';
import { DateType, MonthData } from '../types/types';

const useCreateCalendarMonths = (dateRange: { from: DateType; to: DateType }) => {
    const monthsData: MonthData[] | undefined = useMemo(() => {
        if (dateRange) {
            const { from, to } = dateRange;
            const starting = new Date(from.year, from.monthIndex, from.date); // Example - for the following comments: "2025-02-25"
            const startingDay = starting.getDay();
            const startingFirstWeekdayOfMonth = wrapNumber(startingDay - wrapNumber(from.date - 1, 7) + 7, 7);

            const ending = new Date(to.year, to.monthIndex, to.date);
            const endingDay = ending.getDay();
            const endingFirstWeekdayOfMonth = wrapNumber(endingDay - wrapNumber(to.date - 1, 7) + 7, 7);

            const monthDates: MonthData[] = [];
            const monthsDifference = wrapNumber(to.monthIndex - wrapNumber(from.monthIndex, 12) + 12, 12); // WARN bugs out at 12+ months, but should suffice

            for (let i = 0; i < monthsDifference + 1; i++) {
                const previousMonth = monthDates[i - 1];

                const monthStep = wrapNumber(from.monthIndex + i, 12);
                const yearStep = monthStep < from.monthIndex ? from.year + 1 : from.year;
                const daysInMonth = getDaysInMonth(monthStep, yearStep);

                let date, monthIndex, year, firstWeekDay, daysInMonthBefore;
                if (i === 0) {
                    const monthBeforeRangeIndex = wrapNumber(from.monthIndex - 1, 12);

                    date = from.date;
                    monthIndex = from.monthIndex;
                    year = from.year;
                    firstWeekDay = startingFirstWeekdayOfMonth;
                    daysInMonthBefore = getDaysInMonth(monthBeforeRangeIndex, monthBeforeRangeIndex > from.monthIndex ? from.year - 1 : from.year);
                } else if (i === monthsDifference) {
                    date = to.date;
                    monthIndex = to.monthIndex;
                    year = to.year;
                    firstWeekDay = endingFirstWeekdayOfMonth;
                    daysInMonthBefore = previousMonth.daysInMonth;
                } else {
                    date = 0;
                    monthIndex = monthStep;
                    year = yearStep;
                    firstWeekDay = wrapNumber(previousMonth.firstWeekDay + previousMonth.daysInMonth, 7);
                    daysInMonthBefore = previousMonth.daysInMonth;
                }

                monthDates.push({
                    date,
                    monthIndex,
                    year,
                    daysInMonth,
                    daysInMonthBefore,
                    firstWeekDay,
                });
            }

            return monthDates;
        }
    }, [dateRange]);

    return monthsData;
};

export default useCreateCalendarMonths;
