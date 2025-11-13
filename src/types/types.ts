import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: {
        countries: components['schemas']['CountryReference']['isoCode'][];
        travelDates: {
            from: string; // 2025-01-01 (Date.toLocaleDateString('en-CA'))
            to: string; // 2025-12-31
        };
    };
    methods: {
        store_setCountries: (countries: ZustandStore['values']['countries']) => void;
        store_setTravelDates: (travelDates: Partial<ZustandStore['values']['travelDates']>) => void;
    };
}
