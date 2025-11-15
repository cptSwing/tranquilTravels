import { useZustandStore } from '../lib/zustandStore';
import { CSSProperties, Fragment, ReactNode, useMemo } from 'react';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { DateRange, MonthData } from '../types/types';
import { getDateString, isInRange } from '../lib/handleDates';
import { $api } from '../lib/api';
import config from '../config/config.json';
import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import isDefined from '../lib/isDefined';
import { classNames } from 'cpts-javascript-utilities';
import useCreateCalendarMonths from '../hooks/useCreateCalendarMonths';

const ResultsByMonth = () => {
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
    const calendarMonths = useCreateCalendarMonths({ from, to });

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
    if (!blockedRanges || !freeRanges || !calendarMonths) return;

    return (
        <div className="pointer-events-none grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {calendarMonths.map((calendarMonth, idx) => (
                <SingleMonth
                    key={from.dateString + to.dateString + idx}
                    userRange={{ startDate: from.dateString, endDate: to.dateString }}
                    blockedRanges={blockedRanges}
                    freeRanges={freeRanges}
                    calendarMonth={calendarMonth}
                />
            ))}
        </div>
    );
};

export default ResultsByMonth;

const SingleMonth = ({
    userRange,
    blockedRanges,
    freeRanges,
    calendarMonth,
}: {
    userRange: DateRange;
    blockedRanges: DateRange[];
    freeRanges: DateRange[];
    calendarMonth: MonthData;
}) => {
    const { monthIndex, year, daysInMonth, daysInMonthBefore, firstWeekDay } = calendarMonth;

    const dayCells = useMemo(() => {
        const dayCells = Array.from({ length: daysInMonth }).map((_, idx) => (
            <GridCell key={daysInMonth + idx} cellDate={idx + 1}>
                {/* Blocked */}
                <MarkRange calendarMonth={calendarMonth} ranges={blockedRanges} arrayIndex={idx} color="crimson" />
                {/* Free */}
                <MarkRange calendarMonth={calendarMonth} ranges={freeRanges} arrayIndex={idx} color="darkseagreen" />

                <MarkUserRange calendarMonth={calendarMonth} userRange={userRange} arrayIndex={idx} />
            </GridCell>
        ));

        // Add empty cells to display calendar dates at correct starting weekday:
        dayCells.unshift(
            ...Array.from({ length: firstWeekDay }).map((_, idx) => (
                <GridCell key={firstWeekDay + idx} cellDate={daysInMonthBefore - firstWeekDay + idx + 1} isCurrentMonth={false} />
            )),
        );
        dayCells.push(
            ...Array.from({ length: (7 - ((daysInMonth + firstWeekDay) % 7)) % 7 }).map((_, idx) => (
                <GridCell key={daysInMonth + firstWeekDay + idx} cellDate={idx + 1} isCurrentMonth={false} />
            )),
        );

        return dayCells;
    }, [daysInMonth, firstWeekDay, calendarMonth, blockedRanges, freeRanges, userRange, daysInMonthBefore]);

    return (
        <div className="rounded-xs border border-white/20 bg-teal-400 p-2 text-center shadow-md">
            {MONTH_NAMES[monthIndex]} {year}
            <div className="row-auto grid grid-cols-7 border border-neutral-400 bg-neutral-50">
                <WeekdayNames />
                {dayCells.map((elem, idx) => (
                    <Fragment key={idx}>{elem}</Fragment>
                ))}
            </div>
        </div>
    );
};

const GridCell = ({ children, cellDate, isCurrentMonth = true }: { children?: ReactNode; cellDate: number; isCurrentMonth?: boolean }) => {
    return (
        <div
            key={cellDate}
            className="relative z-0 flex h-8 flex-col items-center justify-center overflow-hidden pt-px before:absolute before:top-0 before:left-0 before:-z-10 before:size-full before:border-t before:border-l before:border-neutral-300/70 nth-[7n+1]:[--is-row-left-edge:1] nth-[7n-13]:before:border-l-0 nth-[7n-7]:[--is-row-right-edge:1]"
        >
            {children}
            <div className={isCurrentMonth ? 'z-10 text-neutral-100 only-of-type:text-neutral-700' : 'text-neutral-200'}>{cellDate}</div>
        </div>
    );
};

const MarkUserRange = ({ calendarMonth, userRange, arrayIndex }: { calendarMonth: MonthData; userRange: DateRange; arrayIndex: number }) => {
    const { monthIndex, year } = calendarMonth;
    const thisDateString = getDateString({ date: arrayIndex + 1, monthIndex, year });
    const inRange = isInRange(thisDateString, userRange.startDate, userRange.endDate);

    if (!inRange) return null;

    const rangePosition = getRangePosition(thisDateString, userRange.startDate, userRange.endDate);

    return (
        <div
            className={classNames(
                'absolute -z-10 size-full bg-yellow-500/40',
                rangePosition === 'first' ? 'rounded-tl-md' : rangePosition === 'last' ? 'rounded-br-md' : '',
            )}
        />
    );
};

const MarkRange = ({ calendarMonth, ranges, arrayIndex, color }: { calendarMonth: MonthData; ranges: DateRange[]; arrayIndex: number; color: string }) => {
    const { monthIndex, year } = calendarMonth;
    const thisDateString = getDateString({ date: arrayIndex + 1, monthIndex, year });
    const range = ranges.find((r) => isInRange(thisDateString, r.startDate, r.endDate));

    if (!range) return null;

    const rangePosition = getRangePosition(thisDateString, range.startDate, range.endDate);

    return (
        <div
            className={classNames(
                'pointer-events-auto absolute h-4/5 w-[calc(100%-var(--left-spacing,0px)/2-var(--right-spacing,0px)/2)] opacity-80',
                '[--left-spacing:calc(--spacing(1.5)*var(--is-row-left-edge))] [--right-spacing:calc(--spacing(1.5)*var(--is-row-right-edge))]',
                'mr-(--right-spacing) ml-(--left-spacing) rounded-l-[calc(var(--radius-sm)*var(--is-row-left-edge))] rounded-r-[calc(var(--radius-sm)*var(--is-row-right-edge))]',
                'after:text-2xs after:absolute after:top-0 after:left-0 after:h-fit after:w-[500%] after:max-w-[50dvw] after:content-none hover:after:content-[attr(data-name)]',
            )}
            style={
                {
                    'backgroundColor': color,
                    '--is-row-left-edge': rangePosition === 'single' || rangePosition === 'first' ? 1 : undefined,
                    '--is-row-right-edge': rangePosition === 'single' || rangePosition === 'last' ? 1 : undefined,
                } as CSSProperties
            }
            data-name={range.name?.[0].text}
        />
    );
};

const WeekdayNames = () =>
    WEEKDAY_NAMES.map((weekDayName, idx) => (
        <div key={weekDayName + idx} className="border-b border-neutral-400 bg-neutral-500 text-center text-neutral-100">
            {weekDayName}
        </div>
    ));

function getRangePosition(date: string, rangeStart: string, rangeEnd: string): 'first' | 'last' | 'middle' | 'single' {
    return date === rangeStart && date === rangeEnd ? 'single' : date === rangeStart ? 'first' : date === rangeEnd ? 'last' : 'middle';
}
