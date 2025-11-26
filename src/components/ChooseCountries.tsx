import { useMemo } from 'react';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';
import ComboboxDropdown from './ComboBox';
import { ComboboxItem } from '../types/types';
import useQueryCountries from '../hooks/useQueryCountries';

const store_setCountriesCapped = useZustandStore.getState().methods.store_setCountriesCapped;

const ChooseCountries = () => {
    const { data, error, isLoading } = useQueryCountries();

    const countriesList = useMemo(() => {
        if (data) {
            const countries: ComboboxItem[] = data
                .map((countryResponse) => {
                    const nameInLanguage = countryResponse.name.find((localizedText) => localizedText.language === config.language);
                    if (nameInLanguage) return { value: countryResponse.isoCode, text: nameInLanguage.text };
                })
                .filter(isDefined)
                .sort((a, b) => (a.text < b.text ? -1 : 1));
            if (countries.length) return countries;
        }
    }, [data]);

    const selectedCountries = useZustandStore((store) => store.values.countries);

    if (error) return <DisplayError error={error} />;
    if (isLoading) return <DisplayLoading />;

    return (
        <div className="level-2 flex flex-grow-2 flex-col items-start justify-between gap-y-2 p-(--options-elements-padding)">
            <div className="">
                <h6 className="text-theme-cta-foreground mb-0.5 block text-left font-serif leading-tight">3. Select Countries To Avoid:</h6>
                <p className="text-theme-text-dark text-left text-xs">
                    Pick countries you&apos;d want to keep an eye on. Maybe because they have large populations, or seem particularly annoying (Germans).
                </p>
            </div>

            <div className="flex flex-row items-end justify-between gap-3 md:flex-col md:gap-4 lg:flex-row lg:items-end">
                {countriesList && (
                    <ComboboxDropdown
                        items={countriesList}
                        selectedItems={selectedCountries}
                        label="Select from list, or type:"
                        onChangeCb={(selectedValues) => store_setCountriesCapped(selectedValues)}
                        extraClassNames="shrink-0 grow lg:grow-2 text-theme-text-dark"
                    />
                )}

                <CountryPills selectedCountries={selectedCountries} extraClassNames="grow lg:grow-3 " />
            </div>
        </div>
    );
};

export default ChooseCountries;

const CountryPills = ({ selectedCountries, extraClassNames }: { selectedCountries: ComboboxItem[]; extraClassNames?: string }) =>
    selectedCountries.length ? (
        <div className={extraClassNames}>
            <span className="text-theme-text-dark pl-px text-xs">
                Selected ({selectedCountries.length}/{config.countrySelectionMax}) :
            </span>
            <ul className="flex flex-row flex-wrap gap-1.5">
                {selectedCountries.map((country) => {
                    return (
                        <li
                            key={country.text + country.value}
                            className="bg-theme-cta-background hover:bg-theme-cta-background/80 group outline-theme-cta-background flex max-w-fit flex-1 items-center justify-start gap-x-2 rounded-lg py-px pr-2 pl-1.5 whitespace-nowrap -outline-offset-1 select-none hover:outline"
                        >
                            <button
                                className="hover:bg-theme-cta-foreground peer text-theme-accent hover:text-theme-text-light flex aspect-square h-3.5 cursor-pointer items-center justify-center rounded-xs bg-white text-[0.75rem] leading-none transition-[color,background-color]"
                                onClick={() => {
                                    const newSelection = selectedCountries.filter((selectedCountry) => selectedCountry.value !== country.value);
                                    store_setCountriesCapped(newSelection);
                                }}
                            >
                                &#10005;
                            </button>
                            <span className="text-theme-text-light inline-block text-center text-sm text-nowrap">{country.text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    ) : null;
