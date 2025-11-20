import { useMemo } from 'react';
import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';
import SelectDropdown from './SelectDropdown';

const { store_setCountries, store_setRangeDescription } = useZustandStore.getState().methods;

const ChooseCountries = () => {
    const { data, error, isLoading } = $api.useQuery('get', '/Countries');

    const listCountries = useMemo(() => {
        if (data) {
            const countries = data
                .map((countryResponse) => {
                    const nameInLanguage = countryResponse.name.find((localizedText) => localizedText.language === config.language);
                    if (nameInLanguage) return { value: countryResponse.isoCode, text: nameInLanguage.text };
                })
                .filter(isDefined);
            if (countries.length) return countries;
        }
    }, [data]);

    const selectedCountries = useZustandStore((store) => store.values.countries);
    const hasSelectedCountries = isDefined(selectedCountries[0]);

    if (error) return <DisplayError error={error} />;
    if (isLoading) return <DisplayLoading />;

    return (
        <div className="level-2 flex basis-1/2 flex-col items-start justify-between gap-x-4 p-2 sm:flex-row">
            <div>
                {/* <label htmlFor="select-isocodes" className="mb-px block pl-px text-xs">
                    Countries to avoid:
                </label> */}

                <SelectDropdown
                    name="select-isocodes"
                    label="Countries to avoid:"
                    selectionItems={listCountries}
                    placeholder="Select&hellip;PLS"
                    onChangeCb={(selectedValues) => {
                        store_setRangeDescription('');
                        store_setCountries(selectedValues);
                    }}
                />

                {/* TODO expand to multiple selections */}
                {/* <select
                    id="select-isocodes"
                    className="bg-theme-cta-background text-theme-cta-foreground w-full rounded-xs pl-px"
                    // multiple
                    value={selectedCountries[0]}
                    onChange={(ev) => {
                        store_setRangeDescription('');
                        store_setCountries([ev.target.value]);
                    }}
                >
                    <button>
                        <selectedontent></selectedontent>
                    </button>
                    {!hasSelectedCountries && <option>select..</option>}
                    {listCountries?.map((countryName, idx) => (
                        <option key={countryName.text + idx} value={countryName.isoCode} className="bg-amber-50">
                            {countryName.text}
                        </option>
                    ))}
                </select> */}
            </div>

            <div>
                <span className="pl-px text-xs">Current Picks:</span>
                <ul className="flex flex-col gap-1.5 lg:flex-row">
                    <li className="bg-theme-cta-foreground text-theme-cta-background flex w-fit items-center justify-between rounded-lg px-2 text-center">
                        <span className="text-2xs mr-1">&#10005;</span>
                        <span>Elbonia</span>
                    </li>
                    <li className="bg-theme-cta-foreground text-theme-cta-background flex w-fit items-center justify-between rounded-lg px-2 text-center">
                        <span className="text-2xs mr-1">&#10005;</span>
                        <span>Cthulhu</span>
                    </li>
                    <li className="bg-theme-cta-foreground text-theme-cta-background flex w-fit items-center justify-between rounded-lg px-2 text-center">
                        <span className="text-2xs mr-1">&#10005;</span>
                        <span className="">Oz</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ChooseCountries;
