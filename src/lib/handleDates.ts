import { DateType } from '../types/types';

export function getDateString(dateObject: DateType) {
    const { year, monthIndex, date } = dateObject;
    const paddedMonth = (monthIndex + 1).toString().padStart(2, '0');
    const paddedDate = date.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDate}`;
}

export function splitDateString(dateString: string) {
    const dateArray = dateString.split('-');

    if (dateArray.length !== 3) {
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

function _isValidDateRange(from: string, to: string) {
    return to > from;
}
