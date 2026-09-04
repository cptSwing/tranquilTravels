import { DateRangePoint } from '../types/types';
import { wrapNumber } from './modulo';
import config from '../config/config.json';

/*
    Example date string from OpenHoliday Api: "2025-02-25" (use Date.toLocaleDateString('en-CA'), canadian locale)
    --> Date = 25
    --> MonthIndex = 1 (0-based indices)
    --> Year = 2025
    And: --> Day = 2 (get with Date.getUTCDay() - 0-based indices starting on Sundays, the 25th was a TUESDAY)
*/

export function createDateString(dateObject: Omit<DateRangePoint, 'dateString'>): string {
    const { year, monthIndex, day } = dateObject;
    const paddedMonth = (monthIndex + 1).toString().padStart(2, '0');
    const paddedDate = day.toString().padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDate}`;
}

export function splitDateString(dateString: DateRangePoint['dateString']) {
    try {
        if (typeof dateString !== 'string') {
            throw new Error('dateString is not of type "string"!', dateString);
        } else {
            if (!regexTestDateString(dateString)) {
                throw new Error(`invalid date string! ${dateString} - format should be "2025-12-24"`);
            }
            const dateArray = dateString.split('-');

            const [year, month, day] = dateArray.map((dateElem) => parseInt(dateElem, 10));
            return {
                year,
                monthIndex: month - 1,
                day,
            };
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}

/* https://stackoverflow.com/a/315767 - skips to next month and by picking date 0, wraps back to last date of previous month */
export function getDaysInMonth(monthIndex: number, year: number) {
    return new Date(year, monthIndex + 1, 0).getDate();
}

export function isInRange(date: string, rangeStart: string, rangeEnd: string) {
    return date >= rangeStart && date <= rangeEnd;
}

export function getFirstWeekdayIndex(rangePoint: DateRangePoint) {
    const { day, monthIndex, year } = rangePoint;
    const dateObj = new Date(year, monthIndex, day); // Example - for the following comments: "2025-02-25"
    const weekdayIndex = dateObj.getDay();
    const firstWeekdayIndex = wrapNumber(weekdayIndex - wrapNumber(day - 1, 7) + 7, 7);

    return firstWeekdayIndex;
}

export function wrapYear(currentMonthIndex: number, currentYear: number, monthsDifference: number): number {
    const currentDate = new Date(currentYear, currentMonthIndex);
    currentDate.setMonth(currentMonthIndex + monthsDifference);
    return currentDate.getFullYear();
}

/**
 * Tests for both '2011-10-05T14:48:00.000Z' date time, as well as '2022-01-20' date. Creates a new Date() object as final test.
 *
 *  https://stackoverflow.com/a/77286865
 *
 * @param {string} dateString
 * @returns {boolean}
 */
export function isISODateString(dateString: string): boolean {
    if (dateString.includes('T')) {
        // this is datetime
        if (!regexTestDateTimeString(dateString)) return false;
    } else if (!regexTestDateString(dateString)) {
        // this is date only
        return false;
    }
    const d = new Date(dateString);
    return d instanceof Date && !isNaN(d.getTime()) && d.toISOString().startsWith(dateString); // valid date
}

export function dateNowToStoreFormat(when: 'now' | 'future'): DateRangePoint {
    let date = new Date();
    if (when === 'future') date = new Date(new Date(date).setMonth(date.getMonth() + Math.abs(config.monthsFromNow)));

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const dateString = date.toISOString().split('T')[0];

    return { day, monthIndex, year, dateString };
}

// Local Functions

function regexTestDateString(dateString: string) {
    return /\d{4}-\d{2}-\d{2}/.test(dateString);
}

function regexTestDateTimeString(dateString: string) {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString);
}
