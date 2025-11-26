import { useZustandStore } from '../lib/zustandStore';
import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import useCreateCalendarMonths from '../hooks/useCreateCalendarMonths';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';
import useQueryHolidaysByCountries from '../hooks/useQueryHolidaysByCountries';
import CalendarMonth from './CalendarMonth';
import { useEffect } from 'react';
import debounce from '../lib/debounce';

const Calendar = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const { data, isPending, errors } = useQueryHolidaysByCountries(from.dateString, to.dateString);
    const { blockedRangesSchool, blockedRangesPublic } = useProcessHolidayResponse(data) ?? {};
    const monthsData = useCreateCalendarMonths({ from, to });

    if (errors.length) return <DisplayError error={errors} />;
    if (isPending) return <DisplayLoading />;
    if (!monthsData) return;

    return (
        <div className="level-1 pointer-events-none z-0 grid w-full grid-cols-1 gap-4 p-(--main-elements-padding) [--calendar-grid-cell-height:--spacing(9)] [--calendar-grid-cell-width:--spacing(auto)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DeactiveDateDetails />

            {monthsData?.map((monthData, idx) => (
                <CalendarMonth
                    key={from.dateString + to.dateString + idx}
                    monthData={monthData}
                    userRange={{ startDate: from.dateString, endDate: to.dateString }}
                    blockedRangesSchool={blockedRangesSchool}
                    blockedRangesPublic={blockedRangesPublic}
                />
            ))}
        </div>
    );
};

export default Calendar;

const store_setDateDetails = useZustandStore.getState().methods.store_setDateDetails;
const debounceSetDateDetailsInactive = debounce(() => store_setDateDetails(false), 5000);

/* Going slightly overboard with the 'checkbox-hack' but ok */
const DeactiveDateDetails = () => {
    const dateDetailsActive = useZustandStore((s) => s.values.dateDetailsActive);

    useEffect(() => {
        if (dateDetailsActive) {
            debounceSetDateDetailsInactive();
        }
    }, [dateDetailsActive]);

    return (
        <input
            type="radio"
            name="calender-days-input-radio-name"
            id="calendar-days-input-radio-none-selected"
            className="hidden"
            checked={!dateDetailsActive}
            onChange={() => {}}
        />
    );
};
