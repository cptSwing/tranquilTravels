import { useMemo } from 'react';
import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';

const store_setCountries = useZustandStore.getState().methods.store_setCountries;

const ChooseCountries = () => {
    const { listCountries, errorCountries: _errorCountries, isLoadingCountries: _isLoadingCountries } = useCountries();
    const selectedCountries = useZustandStore((store) => store.values.countries);
    const hasSelectedCountries = isDefined(selectedCountries[0]);

    return (
        <div className="rounded-xs bg-neutral-500 p-2 shadow-lg">
            <h4>Pick Countries to Query</h4>
            <div className="h-24 py-8">
                <label>
                    Pick countries to avoid:
                    <br />
                    {/* TODO expand to multiple selections */}
                    <select
                        name="select-isocodes"
                        className="rounded-xs bg-neutral-100"
                        value={selectedCountries[0]}
                        onChange={(ev) => store_setCountries([ev.target.value])}
                    >
                        {!hasSelectedCountries && <option>select..</option>}
                        {listCountries &&
                            listCountries.map((countryName, idx) => (
                                <option key={countryName.text + idx} value={countryName.isoCode}>
                                    {countryName.text}
                                </option>
                            ))}
                    </select>
                </label>
            </div>
        </div>
    );
};

export default ChooseCountries;

const useCountries = () => {
    const { data, error, isLoading } = $api.useQuery('get', '/Countries');

    const listCountries = useMemo(() => {
        if (data) {
            const countries = data
                .map((countryResponse) => {
                    const nameInLanguage = countryResponse.name.find((localizedText) => localizedText.language === config.language);

                    if (nameInLanguage) return { isoCode: countryResponse.isoCode, text: nameInLanguage.text };
                })
                .filter(isDefined);
            if (countries.length) return countries;
        }
    }, [data]);

    return { listCountries, errorCountries: error, isLoadingCountries: isLoading };
};
