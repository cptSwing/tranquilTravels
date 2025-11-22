import { useZustandStore } from '../lib/zustandStore';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { DateRange, DayCellData, MonthData } from '../types/types';
import { isInRange } from '../lib/handleDates';
import { $api } from '../lib/api';
import { useQueries } from '@tanstack/react-query';
import config from '../config/config.json';
import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import isDefined from '../lib/isDefined';
import { classNames } from 'cpts-javascript-utilities';
import useCreateCalendarMonths from '../hooks/useCreateCalendarMonths';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';

const store_setRangeDescription = useZustandStore.getState().methods.store_setRangeDescription;

const Calendar = () => {
    const selectedCountries = useZustandStore((store) => store.values.countries);
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const combinedResponse = useQueries({
        queries: selectedCountries.map((countryItem) =>
            $api.queryOptions('get', '/SchoolHolidays', {
                params: {
                    query: {
                        countryIsoCode: countryItem.value,
                        validFrom: from.dateString, // TODO should be from beginning of month (or rather, beginning of calenderview)
                        validTo: to.dateString, // TODO should be to end of month (or rather, end of calenderview)
                        languageIsoCode: config.language,
                    },
                },
            }),
        ),
        combine: (results) => {
            return {
                data: results.map((result) => result.data).filter(isDefined),
                pending: results.some((result) => result.isPending),
                error: results.map((result) => result.error).filter(isDefined),
            };
        },
    });

    const { blockedRanges } = useProcessHolidayResponse(combinedResponse.data);
    const monthsData = useCreateCalendarMonths({ from, to });

    if (combinedResponse.error.length) return <DisplayError error={combinedResponse.error[0]} />;
    if (combinedResponse.pending) return <DisplayLoading />;
    if (!monthsData) return;

    return (
        <div className="level-1 pointer-events-none z-0 mb-4 grid w-full grid-cols-1 gap-4 p-(--main-elements-padding) [--calendar-grid-cell-height:--spacing(8)] [--calendar-grid-cell-width:--spacing(auto)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {monthsData?.map((monthData, idx) => (
                <CalendarMonth
                    key={from.dateString + to.dateString + idx}
                    monthData={monthData}
                    userRange={{ startDate: from.dateString, endDate: to.dateString }}
                    blockedRanges={blockedRanges}
                />
            ))}
        </div>
    );
};

export default Calendar;

const CalendarMonth = ({ monthData, userRange, blockedRanges }: { monthData: MonthData; userRange: DateRange; blockedRanges?: DateRange[] | undefined }) => {
    const { monthIndex, year, cells } = monthData;

    return (
        <div className="">
            <h5 className="text-theme-accent mb-1 inline-block pl-1.5 text-left font-serif leading-none">
                {MONTH_NAMES[monthIndex]} {year}
            </h5>

            <div className="level-2 border-theme-cta-foreground/20! grid grid-cols-7 overflow-hidden">
                <WeekdayNames />
                {cells.map((cell) => {
                    const positionInUserRange = getPositionInRange(cell.dateString, userRange.startDate, userRange.endDate);
                    const blockedRange = blockedRanges?.find((r) => isInRange(cell.dateString, r.startDate, r.endDate)); // TODO could pre-filter per-month? compare cell[0] and cell[length-1] datestrings?
                    const positionInBlockedRange = blockedRange ? getPositionInRange(cell.dateString, blockedRange.startDate, blockedRange.endDate) : null;
                    // const isThisRangeDescription = rangeDescription === range?.name;

                    return (
                        <CalendarDay
                            key={cell.dateString}
                            dayCell={cell}
                            positionInUserRange={positionInUserRange}
                            positionInBlockedRange={positionInBlockedRange}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const CalendarDay = ({
    dayCell,
    positionInUserRange,
    positionInBlockedRange,
}: {
    dayCell: DayCellData;
    positionInUserRange: RangePosition;
    positionInBlockedRange: RangePosition;
}) => {
    const { date, monthPosition } = dayCell;
    const isOutsideUserRangeInsideBlockedRange = !positionInUserRange && positionInBlockedRange;
    const isAtUserRangeExtents = positionInUserRange === 'first' || positionInUserRange === 'last';

    return (
        <div
            className={classNames(
                '[--month-view-has-outer-left-edge:0] [--month-view-has-outer-right-edge:0] [--month-view-top-is-inner-horiz-edge:0] nth-[7n]:[--month-view-has-outer-right-edge:1] nth-[7n+8]:[--month-view-has-outer-left-edge:1] nth-[n+15]:[--month-view-top-is-inner-horiz-edge:1]',
                'relative flex h-(--calendar-grid-cell-height) w-(--calendar-grid-cell-width) flex-col items-center justify-center',
                monthPosition === 'currentMonth' ? 'bg-white' : 'bg-neutral-100',
            )}
        >
            {/* Grid */}
            <div className="absolute top-0 left-0 box-content size-full border-t-[calc(theme(spacing.px)*var(--month-view-top-is-inner-horiz-edge))] border-l-[calc(theme(spacing.px)*(1-var(--month-view-has-outer-left-edge)))] border-neutral-100" />

            {/* Blocked-Range Cell (School Holidays) */}
            {positionInBlockedRange && (
                <div
                    className={classNames(
                        'absolute top-1.5 right-[calc(--spacing(1)*var(--month-view-has-outer-right-edge))] bottom-1.5 left-[calc(--spacing(1)*var(--month-view-has-outer-left-edge))] rounded-l-[calc(4px*var(--month-view-has-outer-left-edge))] rounded-r-[calc(4px*var(--month-view-has-outer-right-edge))]',
                        monthPosition === 'currentMonth'
                            ? positionInUserRange
                                ? positionInUserRange === 'first'
                                    ? 'to-theme-blocked-range-active-holiday-school from-theme-blocked-range-inactive-holiday-school bg-linear-to-r'
                                    : positionInUserRange === 'last'
                                      ? 'to-theme-blocked-range-active-holiday-school from-theme-blocked-range-inactive-holiday-school bg-linear-to-l'
                                      : // 'middle' or 'single'
                                        'bg-theme-blocked-range-active-holiday-school'
                                : 'bg-theme-blocked-range-inactive-holiday-school'
                            : 'border-theme-blocked-range-inactive-holiday-school border-t border-r-[calc(1px*var(--month-view-has-outer-right-edge))] border-b border-l-[calc(1px*var(--month-view-has-outer-left-edge))]',
                        positionInBlockedRange === 'first'
                            ? '[--month-view-has-outer-left-edge:1]'
                            : positionInBlockedRange === 'last'
                              ? '[--month-view-has-outer-right-edge:1]'
                              : positionInBlockedRange === 'single'
                                ? '[--month-view-has-outer-left-edge:1] [--month-view-has-outer-right-edge:1]'
                                : '',
                    )}
                />
            )}

            {/* User-Range start- and endpoints */}
            <div
                className={classNames(
                    'bg-theme-cta-background after:bg-theme-accent outline-theme-accent absolute top-[-5%] left-1/2 z-10 aspect-square h-[110%] -translate-x-1/2 rounded-full outline-5 -outline-offset-1 after:absolute after:top-[12%] after:bottom-[12%] after:-z-10',
                    isAtUserRangeExtents
                        ? positionInUserRange === 'first'
                            ? 'after:-right-1/2 after:left-1/2 after:[clip-path:polygon(50%_0%,90%_50%,50%_100%)]'
                            : 'after:right-1/2 after:-left-1/2 after:[clip-path:polygon(50%_0%,10%_50%,50%_100%)]'
                        : 'hidden',
                )}
            />

            <span
                className={classNames(
                    'z-20 font-light',
                    monthPosition === 'currentMonth'
                        ? isOutsideUserRangeInsideBlockedRange
                            ? 'text-theme-blocked-range-active-holiday-school'
                            : isAtUserRangeExtents
                              ? 'text-theme-cta-foreground text-base! font-normal!'
                              : positionInBlockedRange
                                ? 'text-red-600'
                                : 'text-green-600'
                        : 'text-neutral-400',
                )}
            >
                {date}
            </span>
        </div>
    );

    function handleClick(range: DateRange | undefined) {
        store_setRangeDescription(range?.description ? range.description : '');
    }
};

const WeekdayNames = () =>
    WEEKDAY_NAMES.map((weekDayName, idx) => (
        <div
            key={weekDayName + idx}
            className="text-2xs w-(--calendar-grid-cell-width) border-b border-neutral-300 bg-neutral-200 pt-0.5 pb-1 text-center text-neutral-400 uppercase first-letter:text-xs"
        >
            {weekDayName}
        </div>
    ));

function getPositionInRange(date: string, rangeStart: string, rangeEnd: string): RangePosition {
    if (date < rangeStart || date > rangeEnd) return null;
    return date === rangeStart && date === rangeEnd ? 'single' : date === rangeStart ? 'first' : date === rangeEnd ? 'last' : 'middle';
}

type RangePosition = 'first' | 'last' | 'middle' | 'single' | null;
