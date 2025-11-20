import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import { components } from '../types/openHolidaysSchema';
import { $api } from '../lib/api';
import config from '../config/config.json';
import isDefined from '../lib/isDefined';
import { useZustandStore } from '../lib/zustandStore';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';

const DebugHolidayView = () => {
    const selectedCountries = useZustandStore((store) => store.values.countries);
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const { data, error, isLoading } = $api.useQuery(
        'get',
        '/SchoolHolidays',
        {
            params: {
                query: {
                    countryIsoCode: selectedCountries[0],
                    validFrom: from.dateString,
                    validTo: to.dateString,
                    languageIsoCode: config.language,
                },
            },
        },
        {
            enabled: isDefined(selectedCountries[0]),
        },
    );
    const { blockedRanges, freeRanges } = useProcessHolidayResponse(data, from.dateString, to.dateString);

    if (error) return <DisplayError error={error} />;
    if (isLoading) return <DisplayLoading />;
    if (!blockedRanges || !freeRanges) return;

    return (
        <>
            <div className="grid grid-cols-5 gap-2">
                {blockedRanges.map((holidayResponse) => (
                    <HolidayList key={holidayResponse.id} holiday={holidayResponse} />
                ))}
            </div>

            <hr className="my-2" />

            <div className="grid grid-cols-5 gap-2">
                {data?.map((holidayResponse) => (
                    <HolidayList key={holidayResponse.id} holiday={holidayResponse} />
                ))}
            </div>
        </>
    );
};

export default DebugHolidayView;

const HolidayList = ({ holiday }: { holiday: components['schemas']['HolidayResponse'] }) => {
    const { name, startDate, endDate, type, regionalScope, subdivisions, groups } = holiday;
    return (
        <ul className="bg-neutral-400 p-1 text-xs text-neutral-700">
            <li>Name: {name[0].text}</li>
            <li>Starts: {startDate}</li>
            <li>Ends: {endDate}</li>
            <li>Type: {type}</li>
            <li>RegionalScope: {regionalScope}</li>
            {subdivisions && <li>Subdivisions: {subdivisions.map((subd, idx, arr) => subd.shortName + (idx === arr.length - 1 ? '' : ', '))}</li>}
            {groups && <li>Groups: {groups.map((group, idx, arr) => group.shortName + (idx === arr.length - 1 ? '' : ', '))}</li>}
        </ul>
    );
};
