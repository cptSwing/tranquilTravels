import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: {
        countries: ComboboxItem[];
        dateRange: {
            from: DateRangePoint;
            to: DateRangePoint;
        };
        rangeDescription: string;
    };
    methods: {
        store_setCountriesCapped: (countries: ZustandStore['values']['countries']) => void;
        store_setDateRange: (dateRange: Partial<ZustandStore['values']['dateRange']>) => void;
        store_setRangeDescription: (rangeDescription: Partial<ZustandStore['values']['rangeDescription']>) => void;
    };
}

export type ComboboxItem = {
    value: components['schemas']['CountryResponse']['isoCode'];
    text: ArrayElement<components['schemas']['CountryResponse']['name']>['text'];
};

export type DateRangePoint = {
    date: number;
    monthIndex: number;
    year: number;
    dateString: string;
};

export type MonthData = Pick<DateRangePoint, 'year' | 'monthIndex'> & {
    year: number;
    monthIndex: number;
    cells: DayCellData[];
};

export type DayCellData = { date: number; monthPosition: 'previousMonth' | 'currentMonth' | 'nextMonth'; dateString: string };

export type DateRange = {
    startDate: string;
    endDate: string;
    description?: string;
};

/* Helper from https://stackoverflow.com/a/57447842 */
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
