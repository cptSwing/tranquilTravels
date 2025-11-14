import { $api } from '../lib/api';
import config from '../config/config.json';
import { useZustandStore } from '../lib/zustandStore';
import { components } from '../types/openHolidaysSchema';

const SchoolHolidays = () => {
    const selectedCountries = useZustandStore((store) => store.values.countries);
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const { data, error, isLoading } = $api.useQuery(
        'get',
        '/SchoolHolidays',
        {
            params: {
                query: {
                    countryIsoCode: selectedCountries[0],
                    validFrom: from,
                    validTo: to,
                    languageIsoCode: config.language,
                },
            },
        },
        {
            enabled: selectedCountries[0] ? true : false,
        },
    );

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
    if (!data) return;

    return (
        <div className="grid grid-cols-5 gap-2">
            {data.map((holidayResponse) => (
                <SchoolHolidayListItem key={holidayResponse.id} schoolHoliday={holidayResponse} />
            ))}
        </div>
    );
};

export default SchoolHolidays;

const SchoolHolidayListItem = ({ schoolHoliday }: { schoolHoliday: components['schemas']['HolidayResponse'] }) => {
    const { name, startDate, endDate, type } = schoolHoliday;
    return (
        <ul className="bg-neutral-400 p-1 text-sm">
            <li>Name: {name[0].text}</li>
            <li>Starts: {startDate}</li>
            <li>Ends: {endDate}</li>
            <li>Type: {type}</li>
        </ul>
    );
};
