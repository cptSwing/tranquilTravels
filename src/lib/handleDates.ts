import { DateRangePoint } from '../types/types';
import { wrapNumber } from './modulo';

/*
    Example date string from OpenHoliday Api: "2025-02-25" (use Date.toLocaleDateString('en-CA'), canadian locale)
    --> Date = 25
    --> MonthIndex = 1 (0-based indices)
    --> Year = 2025
    And: --> Day = 2 (get with Date.getDay() - 0-based indices starting on Sundays, the 25th was a TUESDAY)
*/

export function getDateString(dateObject: Omit<DateRangePoint, 'dateString'>) {
    const { year, monthIndex, date } = dateObject;
    const paddedMonth = (monthIndex + 1).toString().padStart(2, '0');
    const paddedDate = date.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDate}`;
}

export function splitDateString(dateString: DateRangePoint['dateString']) {
    try {
        if (typeof dateString !== 'string') {
            throw new Error(`dateString (${dateString}) is not of type "string"!`);
        } else {
            const dateArray = dateString.split('-');

            if (dateArray.length !== 3 || dateArray[0].length !== 4 || dateArray[1].length !== 2 || dateArray[2].length !== 2) {
                throw new Error(`invalid date string! ${dateString} - format should be "2025-12-24"`);
            } else {
                const [year, month, date] = dateArray.map((dateElem) => parseInt(dateElem));
                return {
                    year,
                    monthIndex: month - 1,
                    date,
                };
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}

/* https://stackoverflow.com/a/315767 - skips to next month and by picking date 0, wraps back to last date of previous month */
export function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
}

export function isInRange(date: string, rangeStart: string, rangeEnd: string) {
    return date >= rangeStart && date <= rangeEnd;
}

export function getFirstWeekdayIndex(rangePoint: DateRangePoint) {
    const { date, monthIndex, year } = rangePoint;
    const dateObj = new Date(year, monthIndex, date); // Example - for the following comments: "2025-02-25"
    const weekdayIndex = dateObj.getDay();
    const firstWeekdayIndex = wrapNumber(weekdayIndex - wrapNumber(date - 1, 7) + 7, 7);

    return firstWeekdayIndex;
}

export function wrapYear(currentMonthIndex: number, currentYear: number, newMonthIndex: number, direction: 'forward' | 'backward'): number {
    if (currentMonthIndex < newMonthIndex) {
        return direction === 'forward' ? currentYear : currentYear - 1;
    } else if (currentMonthIndex > newMonthIndex) {
        return direction === 'forward' ? currentYear + 1 : currentYear;
    } else {
        return currentYear;
    }
}
