import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: {
        countries: components['schemas']['CountryReference']['isoCode'][];
        dateRange: {
            from: DateType;
            to: DateType;
        };
    };
    methods: {
        store_setCountries: (countries: ZustandStore['values']['countries']) => void;
        store_setDateRange: (dateRange: Partial<ZustandStore['values']['dateRange']>) => void;
    };
}

export type DateType = {
    date: number;
    monthIndex: number;
    year: number;
    dateString: string;
};

export type MonthData = Omit<DateType, 'dateString'> & {
    daysInMonth: number;
    daysInMonthBefore: number;
    firstWeekDay: number;
};

export type DateRange = {
    startDate: string;
    endDate: string;
    name?: components['schemas']['HolidayResponse']['name'];
};
