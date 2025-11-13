import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from '../types/types';

export const useZustandStore = create<ZustandStore>()(
    immer((set, get) => ({
        values: { countries: [] },
        methods: {
            store_setCountries(countries) {
                set((draftStore) => {
                    draftStore.values.countries = countries;
                });
            },
        },
    })),
);
