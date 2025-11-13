import { useMemo } from 'react';
import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';

const store_setCountries = useZustandStore.getState().methods.store_setCountries;

const ChooseCountry = () => {
    const { listCountries, errorCountries, isLoadingCountries } = useCountries();
    const selectedCountries = useZustandStore((store) => store.values.countries);

    return (
        <label>
            Pick countries to avoid:
            <br />
            {/* TODO expand to multiple selections */}
            <select name="select-isocodes" value={selectedCountries[0]} onChange={(ev) => store_setCountries([ev.target.value])}>
                <option value="" disabled={Boolean(selectedCountries[0])}></option>
                {listCountries &&
                    listCountries.map((countryName, idx) => (
                        <option key={countryName.text + idx} value={countryName.isoCode}>
                            {countryName.text}
                        </option>
                    ))}
            </select>
        </label>
    );
};

export default ChooseCountry;

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
