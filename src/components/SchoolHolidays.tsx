import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import { components } from '../types/openHolidaysSchema';

const SchoolHolidays = () => {
    const { data, blockedRanges, freeRanges, error, isLoading } = useProcessHolidayResponse('school');

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
    if (!data || !blockedRanges) return;

    return (
        <>
            <div className="grid grid-cols-5 gap-2">
                {blockedRanges.map((holidayResponse) => (
                    <HolidayList key={holidayResponse.id} holiday={holidayResponse} />
                ))}
            </div>

            <hr className="my-2" />

            <div className="grid grid-cols-5 gap-2">
                {data.map((holidayResponse) => (
                    <HolidayList key={holidayResponse.id} holiday={holidayResponse} />
                ))}
            </div>
        </>
    );
};

export default SchoolHolidays;

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
