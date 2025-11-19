import { useZustandStore } from '../lib/zustandStore';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { DayCellData, MonthData } from '../types/types';
import { isInRange } from '../lib/handleDates';
import { $api } from '../lib/api';
import config from '../config/config.json';
import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import isDefined from '../lib/isDefined';
import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import useCreateCalendarMonths from '../hooks/useCreateCalendarMonths';
import { ReactNode } from 'react';

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
    const { blockedRanges } = useProcessHolidayResponse(data);
    const months = useCreateCalendarMonths({ from, to });

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
    if (!months) return;

    return (
        <div className="level-1 pointer-events-none grid w-full grid-cols-1 gap-4 px-4 pt-2 pb-3 [--calendar-grid-cell-height:--spacing(8)] [--calendar-grid-cell-width:--spacing(auto)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {months.map((monthData, idx) => (
                <CalendarMonth key={from.dateString + to.dateString + idx} monthData={monthData}>
                    <CalendarDaysMarkRange cells={monthData.cells} startDateString={from.dateString} endDateString={to.dateString} />
                    {blockedRanges && <CalendarDaysMarkSchoolHolidays cells={monthData.cells} ranges={blockedRanges} />}
                </CalendarMonth>
            ))}
        </div>
    );
};

export default ResultsByMonth;

const CalendarMonth = ({ monthData, children }: { monthData: MonthData; children: ReactNode }) => {
    const { monthIndex, year, firstWeekdayIndex, cells } = monthData;

    return (
        <div key={`${monthIndex}-${year}-${firstWeekdayIndex}`} className="text-left">
            <span className="text-theme-text-dark pl-1.5">
                {MONTH_NAMES[monthIndex]} {year}
            </span>
            <div className="level-2 overflow-hidden">
                <WeekdayNames />
                <div className="relative">
                    <CalendarDays cells={cells} />
                    {children}
                </div>
            </div>
        </div>
    );
};

const CalendarDays = ({ cells }: { cells: DayCellData[] }) => (
    <div className="grid grid-cols-7">
        {cells.map(({ date, monthPosition, dateString }) => (
            <div
                key={dateString}
                className={classNames(
                    'relative flex h-(--calendar-grid-cell-height) w-(--calendar-grid-cell-width) flex-col items-center justify-center',
                    'before:absolute before:top-0 before:left-0 before:z-10 before:box-border before:h-full before:w-full before:border-l before:border-neutral-200 nth-[7n+1]:before:border-l-0 nth-[n+8]:before:border-t',
                    monthPosition === 'currentMonth' ? 'bg-white text-black' : 'bg-neutral-100 text-neutral-400',
                )}
            >
                {date}
            </div>
        ))}
    </div>
);

const CalendarDaysMarkRange = ({ cells, startDateString, endDateString }: { cells: DayCellData[]; startDateString: string; endDateString: string }) => (
    <div className="absolute top-0 left-0 grid size-full grid-cols-7">
        {cells.map(({ monthPosition, dateString }) => {
            const positionInRange = getPositionInRange(dateString, startDateString, endDateString);

            return (
                <div
                    key={dateString}
                    className={classNames(
                        'relative z-10 h-(--calendar-grid-cell-height) w-(--calendar-grid-cell-width)',
                        monthPosition === 'currentMonth' ? 'after:absolute after:z-20' : 'after:content-none',
                        positionInRange === 'first' || positionInRange === 'last'
                            ? 'after:-top-[10%] after:left-1/2 after:aspect-square after:h-[120%] after:-translate-x-1/2 after:rounded-full after:border-2 after:border-yellow-300 after:bg-yellow-300/60'
                            : 'after:content-none',
                    )}
                />
            );
        })}
    </div>
);

const store_setRangeDescription = useZustandStore.getState().methods.store_setRangeDescription;

const CalendarDaysMarkSchoolHolidays = ({
    cells,
    ranges,
}: {
    cells: DayCellData[];
    ranges: {
        description: string;
        startDate: string;
        endDate: string;
    }[];
}) => {
    const rangeDescription = useZustandStore((store) => store.values.rangeDescription);

    return (
        <div className="absolute top-0 left-0 z-10 grid size-full grid-cols-7">
            {cells.map(({ monthPosition, dateString }) => {
                const range = ranges.find((r) => isInRange(dateString, r.startDate, r.endDate));
                const positionInRange = range ? getPositionInRange(dateString, range.startDate, range.endDate) : undefined;
                const isThisRangeDescription = rangeDescription === range?.description;

                return (
                    <div
                        key={dateString}
                        className="pointer-events-auto relative h-(--calendar-grid-cell-height) w-(--calendar-grid-cell-width) cursor-pointer [--is-row-left-edge:0] [--is-row-right-edge:0] nth-[7n+1]:[--is-row-left-edge:1] nth-[7n-7]:[--is-row-right-edge:1]"
                        onClick={() => handleClick(range)}
                        onKeyDown={() => handleClick(range)}
                        role="button"
                        tabIndex={0}
                    >
                        {/* <div
                            className={classNames(
                                'duration-theme pointer-events-none absolute top-0 left-0 -z-10 size-full transition-[background-color]',
                                isThisRangeDescription ? (monthPosition === 'currentMonth' ? 'bg-orange-300/80' : 'bg-orange-200/80') : 'bg-transparent',
                            )}
                        /> */}

                        {range && positionInRange && (
                            <div
                                className={classNames(
                                    'absolute top-1.5 right-[calc(--spacing(1)*var(--is-row-right-edge))] bottom-1.5 left-[calc(--spacing(1)*var(--is-row-left-edge))] rounded-l-[calc(4px*var(--is-row-left-edge))] rounded-r-[calc(4px*var(--is-row-right-edge))]',
                                    monthPosition === 'currentMonth'
                                        ? 'bg-red-500'
                                        : 'box-border border-t border-r-[calc(1px*var(--is-row-right-edge))] border-b border-l-[calc(1px*var(--is-row-left-edge))] border-red-500/80',
                                    positionInRange === 'first'
                                        ? '[--is-row-left-edge:1]'
                                        : positionInRange === 'last'
                                          ? '[--is-row-right-edge:1]'
                                          : positionInRange === 'single'
                                            ? '[--is-row-left-edge:1] [--is-row-right-edge:1]'
                                            : '',
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );

    function handleClick(
        range:
            | {
                  description: string;
                  startDate: string;
                  endDate: string;
              }
            | undefined,
    ) {
        store_setRangeDescription(range ? range.description : '');
    }
};

const WeekdayNames = () => (
    <div className="grid grid-cols-7 bg-neutral-300">
        {WEEKDAY_NAMES.map((weekDayName, idx) => (
            <div key={weekDayName + idx} className="text-theme-text-light w-(--calendar-grid-cell-width) text-center">
                {weekDayName}
            </div>
        ))}
    </div>
);

function getPositionInRange(date: string, rangeStart: string, rangeEnd: string): 'first' | 'last' | 'middle' | 'single' | undefined {
    if (date < rangeStart || date > rangeEnd) return;
    return date === rangeStart && date === rangeEnd ? 'single' : date === rangeStart ? 'first' : date === rangeEnd ? 'last' : 'middle';
}
