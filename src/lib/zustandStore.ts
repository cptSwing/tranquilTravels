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
            rangeDescription: '',
        },

        methods: {
            store_setCountries(countries) {
                set((draftStore) => {
                    draftStore.values.countries = countries;
                });
            },

            store_setDateRange(dateRange) {
                set((draftStore) => {
                    draftStore.values.dateRange = { ...draftStore.values.dateRange, ...dateRange };
                });
            },

            store_setRangeDescription(rangeDescription) {
                set((draftStore) => {
                    draftStore.values.rangeDescription = rangeDescription;
                });
            },
        },
    })),
);
