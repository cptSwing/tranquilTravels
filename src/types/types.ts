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
};

export type MonthData = {
    date: number;
    month: number;
    year: number;
    daysInMonth: number;
    firstWeekDay: number;
};
