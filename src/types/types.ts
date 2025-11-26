import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: {
        countries: ComboboxItem[];
        dateRange: {
            from: DateRangePoint;
            to: DateRangePoint;
        };
        holidayType: Record<'schoolHoliday' | 'publicHoliday', boolean>;
        dateDetailsActive: boolean;
    };
    methods: {
        store_setCountriesCapped: (countries: ZustandStore['values']['countries']) => void;
        store_setDateRange: (dateRange: Partial<ZustandStore['values']['dateRange']>) => void;
        store_setHolidayType: (type: Partial<ZustandStore['values']['holidayType']>) => void;
        store_setDateDetails: (active: boolean) => void;
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
export type RangePosition = 'first' | 'last' | 'middle' | 'single' | null;

export type DayByCountries = Map<string /* country-iso-code */, Map<string /* holidayNames */, { groups: Set<string>; subdivisions: Set<string> }>>;
export type RangeDays = Map<string /* date-string */, DayByCountries>;

export type DateRange = {
    startDate: string;
    endDate: string;
    dailyDescriptions: RangeDays;
};

/* Helper from https://stackoverflow.com/a/57447842 */
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type MapValue<M> = M extends Map<unknown, infer T> ? T : never;

export type OpenHolidaysApiError = components['schemas']['ProblemDetails'];

export type CountryData = components['schemas']['CountryResponse'];
export type HolidayData = components['schemas']['HolidayResponse'];
export type HolidayDataByCountry = HolidayData & {
    metaData: {
        countryItem: ComboboxItem;
        holidayType: keyof ZustandStore['values']['holidayType'];
    };
};
