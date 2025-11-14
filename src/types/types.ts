import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: {
        countries: components['schemas']['CountryReference']['isoCode'][];
        dateRange: {
            from: string; // 2025-01-01 (Date.toLocaleDateString('en-CA'))
            to: string; // 2025-12-31
        };
    };
    methods: {
        store_setCountries: (countries: ZustandStore['values']['countries']) => void;
        store_setDateRange: (dateRange: Partial<ZustandStore['values']['dateRange']>) => void;
    };
}

export type MonthData = {
    date: number;
    month: number;
    year: number;
    firstWeekDay: number;
};
