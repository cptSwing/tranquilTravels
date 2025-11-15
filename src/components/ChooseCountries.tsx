import { useMemo } from 'react';
import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';

const store_setCountries = useZustandStore.getState().methods.store_setCountries;

const ChooseCountries = () => {
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

    const selectedCountries = useZustandStore((store) => store.values.countries);
    const hasSelectedCountries = isDefined(selectedCountries[0]);

    if (error) {
        return (
            <>
                An error occured (Status {error.status}): {error.title}
                <br />
                {JSON.stringify(error.detail)}
                <br />
                {JSON.stringify(error.errors)}
            </>
        );
    }
    if (isLoading) return 'Loading...';

    return (
        <div className="rounded-xs bg-neutral-300 p-2 shadow-lg">
            <label>
                Pick countries to avoid:
                <br />
                {/* TODO expand to multiple selections */}
                <select
                    name="select-isocodes"
                    className="w-full rounded-xs bg-neutral-100 pl-1 text-justify"
                    value={selectedCountries[0]}
                    onChange={(ev) => store_setCountries([ev.target.value])}
                >
                    {!hasSelectedCountries && <option>select..</option>}
                    {listCountries?.map((countryName, idx) => (
                        <option key={countryName.text + idx} value={countryName.isoCode}>
                            {countryName.text}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default ChooseCountries;
