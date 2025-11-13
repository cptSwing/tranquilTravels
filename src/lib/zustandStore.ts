import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';
import config from '../config/config.json';

export const useZustandStore = create<ZustandStore>()(
    immer((set, get) => ({
        values: {
            countries: [],
            travelDates: {
                from: config.date.from,
                to: config.date.to,
            },
        },

        methods: {
            store_setCountries(countries) {
                set((draftStore) => {
                    draftStore.values.countries = countries;
                });
            },

            store_setTravelDates(travelDates) {
                console.log('%c[zustandStore]', 'color: #b7b528', `travelDates :`, travelDates);
                set((draftStore) => {
                    draftStore.values.travelDates = { ...draftStore.values.travelDates, ...travelDates };
                });
            },
        },
    })),
);
