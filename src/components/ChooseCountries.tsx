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
        <div className="level-2 flex basis-2/4 flex-col items-start justify-between gap-y-2 p-(--options-elements-padding)">
            <div>
                <h6 className="text-theme-accent mb-0.5 block text-left font-serif leading-tight">3. Choose Countries:</h6>
                <p className="text-left text-xs">Pick the countries you&apos;d want to avoid (the bigger, the better obviously?)</p>
            </div>

            <div className="flex w-full flex-col items-start justify-between gap-3 md:gap-4 lg:flex-row lg:items-end">
                {listCountries && (
                    <ComboboxDropdown
                        items={listCountries}
                        selectedItems={selectedCountries}
                        label="Assignees"
                        // description="bla bla bla description"
                        onChangeCb={(selectedValues) => {
                            store_setRangeDescription('');
                            store_setCountriesCapped(selectedValues);
                        }}
                        extraClassNames="shrink-0 lg:basis-1/3  "
                    />
                )}

                <CountryPills selectedCountries={selectedCountries} extraClassNames="lg:basis-2/3 " />
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
            <ul className="flex flex-row flex-wrap gap-1.5 md:flex-col lg:flex-row">
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
