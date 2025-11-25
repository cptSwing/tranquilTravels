import { useZustandStore } from '../lib/zustandStore';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { DateRange, DayCellData, MapValue, MonthData, RangeDays } from '../types/types';
import { isInRange } from '../lib/handleDates';
import useProcessHolidayResponse from '../hooks/useProcessHolidayResponse';
import { classNames } from 'cpts-javascript-utilities';
import useCreateCalendarMonths from '../hooks/useCreateCalendarMonths';
import DisplayError from './DisplayError';
import DisplayLoading from './DisplayLoading';
import useQueryHolidaysByCountries from '../hooks/useQueryHolidaysByCountries';
import config from '../config/config.json';

const Calendar = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const { data, isPending, errors } = useQueryHolidaysByCountries(from.dateString, to.dateString);
    const { blockedRanges } = useProcessHolidayResponse(data);
    const monthsData = useCreateCalendarMonths({ from, to });

    if (errors.length) return <DisplayError errors={errors} />;
    if (isPending) return <DisplayLoading />;
    if (!monthsData) return;

    return (
        <div className="level-1 pointer-events-none z-0 mb-4 grid w-full grid-cols-1 gap-4 p-(--main-elements-padding) [--calendar-grid-cell-height:--spacing(8)] [--calendar-grid-cell-width:--spacing(auto)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <input type="radio" name="calender-months-form" id="calendar-none" className="absolute size-0" />

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
        <div>
            {/* Hidden reset radio */}

            <h5 className="text-theme-accent mb-1.5 inline-block pl-1.5 text-left font-serif leading-none">
                {MONTH_NAMES[monthIndex]} {year}
            </h5>

            <div className="level-2 grid grid-cols-7">
                <WeekdayNames />

                {cells.map((cell) => {
                    const positionInUserRange = getPositionInRange(cell.dateString, userRange.startDate, userRange.endDate);
                    const blockedRange = blockedRanges?.find((r) => isInRange(cell.dateString, r.startDate, r.endDate)); // TODO could pre-filter per-month? compare cell[0] and cell[length-1] datestrings?
                    const positionInBlockedRange = blockedRange && getPositionInRange(cell.dateString, blockedRange.startDate, blockedRange.endDate);
                    const dayDescription = blockedRange?.dailyDescriptions && blockedRange.dailyDescriptions.get(cell.dateString);
                    // const isThisRangeDescription = rangeDescription === range?.name;

                    return (
                        <CalendarDay
                            key={cell.dateString}
                            dayCell={cell}
                            positionInUserRange={positionInUserRange}
                            positionInBlockedRange={positionInBlockedRange}
                            description={dayDescription}
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
    description,
}: {
    dayCell: DayCellData;
    positionInUserRange: RangePosition;
    positionInBlockedRange: RangePosition | undefined;
    description: MapValue<RangeDays> | undefined;
}) => {
    const { date, monthPosition } = dayCell;
    const isOutsideUserRangeInsideBlockedRange = !positionInUserRange && positionInBlockedRange;
    const isAtUserRangeExtents = positionInUserRange === 'first' || positionInUserRange === 'last';
    const dayDescription = description && generateDayDescription(description);

    return (
        <div
            className={classNames(
                '[--month-view-has-outer-left-edge:0] [--month-view-has-outer-right-edge:0] [--month-view-top-is-inner-horiz-edge:0] nth-[7n]:[--month-view-has-outer-right-edge:1] nth-[7n+8]:[--month-view-has-outer-left-edge:1] nth-[n+15]:[--month-view-top-is-inner-horiz-edge:1]',
                'group relative h-(--calendar-grid-cell-height) w-(--calendar-grid-cell-width) select-none',
                monthPosition === 'currentMonth' ? 'bg-white' : 'bg-neutral-100',
            )}
        >
            <input
                id={'input-radio' + date + monthPosition + dayDescription}
                type="radio"
                name="calender-months-form"
                className="peer absolute -z-50 size-0"
                onChange={() => {
                    const timer = setTimeout(() => {
                        const offInput = document.getElementById('calendar-none') as HTMLInputElement;
                        offInput.checked = true;
                        clearTimeout(timer);
                    }, 4000);
                }}
            />

            {/* Date */}
            <label
                htmlFor={'input-radio' + date + monthPosition + dayDescription}
                className={classNames(
                    'pointer-events-auto absolute top-0 left-0 z-20 flex size-full cursor-pointer items-center justify-center font-light',
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
            </label>

            {/* Gridlines */}
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
                    'bg-theme-cta-background after:bg-theme-accent outline-theme-accent absolute top-[-5%] left-1/2 z-10 aspect-square h-[110%] -translate-x-1/2 rounded-full outline-5 -outline-offset-1 after:absolute after:top-[12%] after:bottom-[12%] after:-z-10', //
                    isAtUserRangeExtents
                        ? positionInUserRange === 'first'
                            ? 'after:-right-1/2 after:left-1/2 after:[clip-path:polygon(50%_0%,90%_50%,50%_100%)]'
                            : 'after:right-1/2 after:-left-1/2 after:[clip-path:polygon(50%_0%,10%_50%,50%_100%)]'
                        : 'hidden',
                )}
            />

            {/* Pop up date information */}
            <div className="text-2xs duration-theme absolute top-1/4 left-1/4 z-30 h-auto w-auto origin-top-left scale-x-0 scale-y-50 border border-red-500 bg-white p-1 pb-0.5 text-left font-mono leading-tight whitespace-pre capitalize opacity-0 transition-[opacity,scale] peer-checked:scale-100 peer-checked:opacity-100">
                {dayDescription}
            </div>
        </div>
    );
};

function generateDayDescription(dayDescription: MapValue<RangeDays>) {
    let descriptionString = '';
    dayDescription.forEach((holidayNames, countryCode) => {
        let count = 1;
        descriptionString += countryCode + ':\t';

        holidayNames.forEach(({ groups, subdivisions }, holidayName, map) => {
            const areNotEmpty = groups.size || subdivisions.size;
            const mergedOrNot = config.mergeGroupsAndSubdivisions
                ? ` (${[...groups.union(subdivisions)].join(',')})`
                : ` (${[...groups].join(',')}) (${[...subdivisions].join(',')})`;
            const holidayString = holidayName + (areNotEmpty ? mergedOrNot : '');

            descriptionString += holidayString + (count < map.size ? '\n\t' : '');

            count++;
        });
        descriptionString += '\n';
    });

    return descriptionString;
}

const WeekdayNames = () =>
    WEEKDAY_NAMES.map((weekDayName, idx) => (
        <div
            key={weekDayName + idx}
            className="text-2xs w-(--calendar-grid-cell-width) border-b border-b-neutral-200 pt-1 pb-1.5 text-center text-neutral-400 uppercase first-letter:text-xs"
        >
            {weekDayName}
        </div>
    ));

function getPositionInRange(date: string, rangeStart: string, rangeEnd: string): RangePosition {
    if (date < rangeStart || date > rangeEnd) return null;
    return date === rangeStart && date === rangeEnd ? 'single' : date === rangeStart ? 'first' : date === rangeEnd ? 'last' : 'middle';
}

type RangePosition = 'first' | 'last' | 'middle' | 'single' | null;
