import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: {
        countries: components['schemas']['CountryReference']['isoCode'][];
        dateRange: {
            from: DateRangePoint;
            to: DateRangePoint;
        };
        rangeDescription: string;
    };
    methods: {
        store_setCountries: (countries: ZustandStore['values']['countries']) => void;
        store_setDateRange: (dateRange: Partial<ZustandStore['values']['dateRange']>) => void;
        store_setRangeDescription: (rangeDescription: Partial<ZustandStore['values']['rangeDescription']>) => void;
    };
}

export type DateRangePoint = {
    date: number;
    monthIndex: number;
    year: number;
    dateString: string;
};

export type MonthData = Omit<DateRangePoint, 'date' | 'dateString'> & {
    monthLength: number;
    firstWeekdayIndex: number;
    cells: DayCellData[];
};

export type DayCellData = { date: number; monthPosition: 'previousMonth' | 'currentMonth' | 'nextMonth'; dateString: string };

export type DateRange = {
    startDate: string;
    endDate: string;
    name?: components['schemas']['HolidayResponse']['name'];
};
