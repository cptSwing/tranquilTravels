import { components } from './openHolidaysSchema';

export interface ZustandStore {
    values: { countries: components['schemas']['CountryReference']['isoCode'][] };
    methods: { store_setCountries: (countries: components['schemas']['CountryReference']['isoCode'][]) => void };
}
