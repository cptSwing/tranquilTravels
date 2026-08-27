import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';
import config from '../config/config.json';

export const useZustandStore = create<ZustandStore>()(
    immer((set, _get) => ({
        values: {
            countries: [],
            dateRange: {
                from: config.date.from,
                to: config.date.to,
            },
            holidayType: { schoolHoliday: true, publicHoliday: true },
            dateDetailsActive: false,
        },

        methods: {
            store_setCountriesCapped(countries) {
                let cappedCountries = countries;

                if (countries.length > config.countrySelectionMax) {
                    cappedCountries = countries.slice(0, config.countrySelectionMax);
                }

                set((draftStore) => {
                    draftStore.values.countries = cappedCountries;
                });
            },

            store_setDateRange(dateRange) {
                set((draftStore) => {
                    draftStore.values.dateRange = { ...draftStore.values.dateRange, ...dateRange };
                });
            },

            store_setHolidayType: (type) => {
                set((draftStore) => {
                    draftStore.values.holidayType = { ...draftStore.values.holidayType, ...type };
                });
            },

            store_setDateDetails(active) {
                set((draftStore) => {
                    draftStore.values.dateDetailsActive = active;
                });
            },
        },
    })),
);
