import { useMemo } from 'react';
import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';
import ComboboxDropdown from './ComboBox';
import { ComboboxItem } from '../types/types';

const { store_setCountriesCapped, store_setRangeDescription } = useZustandStore.getState().methods;

const ChooseCountries = () => {
    const { data, error, isLoading } = $api.useQuery('get', '/Countries');

    const listCountries = useMemo(() => {
        if (data) {
            const countries: ComboboxItem[] = data
                .map((countryResponse) => {
                    const nameInLanguage = countryResponse.name.find((localizedText) => localizedText.language === config.language);
                    if (nameInLanguage) return { value: countryResponse.isoCode, text: nameInLanguage.text };
                })
                .filter(isDefined);
            if (countries.length) return countries;
        }
    }, [data]);

    const selectedCountries = useZustandStore((store) => store.values.countries);
    // const hasSelectedCountries = isDefined(selectedCountries[0]);

    if (error) return <DisplayError error={error} />;
    if (isLoading) return <DisplayLoading />;

    return (
        <div className="level-2 basis-2/5 p-(--options-elements-padding)">
            <h6 className="text-theme-cta-foreground block text-left font-serif leading-none">3. Choose Countries:</h6>

            <div className="flex h-[calc(100%-(var(--options-elements-padding)*2))] flex-col items-end justify-between gap-3 md:flex-row md:gap-4">
                {listCountries && (
                    <ComboboxDropdown
                        items={listCountries}
                        selectedItems={selectedCountries}
                        label="Assignees"
                        description="bla bla bla description"
                        onChangeCb={(selectedValues) => {
                            store_setRangeDescription('');
                            store_setCountriesCapped(selectedValues);
                        }}
                        extraClassNames=" shrink-0 basis-2/5"
                    />
                )}

                <CountryPills selectedCountries={selectedCountries} extraClassNames="basis-3/5" />
            </div>
        </div>
    );
};

export default ChooseCountries;

const CountryPills = ({ selectedCountries, extraClassNames }: { selectedCountries: ComboboxItem[]; extraClassNames?: string }) => {
    if (!selectedCountries.length) return null;
    return (
        <div className={extraClassNames}>
            <span className="pl-px text-xs">Current Picks:</span>
            <ul className="flex flex-col flex-wrap gap-1.5 lg:flex-row">
                {selectedCountries.map((country) => {
                    return (
                        <li
                            key={country.text + country.value}
                            className="bg-theme-cta-foreground flex max-w-fit flex-1 items-center justify-start rounded-lg py-px pr-2 pl-1.5 whitespace-nowrap select-none"
                        >
                            <button
                                className="hover:bg-theme-cta-background peer text-theme-text-dark mr-1 flex aspect-square h-3.5 items-center justify-center rounded-xs bg-white text-[0.75rem] leading-none"
                                onClick={() => {
                                    const newSelection = selectedCountries.filter((selectedCountry) => selectedCountry.value !== country.value);
                                    store_setCountriesCapped(newSelection);
                                }}
                            >
                                &#10005;
                            </button>
                            <span className="text-theme-text-light peer-hover:text-theme-cta-background inline-block text-center text-sm text-nowrap">
                                {country.text}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
