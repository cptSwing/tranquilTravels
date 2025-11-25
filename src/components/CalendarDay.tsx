import { classNames } from 'cpts-javascript-utilities';
import { DayCellData, MapValue, RangeDays, RangePosition } from '../types/types';
import config from '../config/config.json';
import { useZustandStore } from '../lib/zustandStore';
import { useMemo } from 'react';

const store_setDateDetails = useZustandStore.getState().methods.store_setDateDetails;

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
    const { date, monthPosition, dateString } = dayCell;
    const isInBlockedRange = !!positionInBlockedRange;
    const isInUserRange = !!positionInUserRange;
    const isOutsideUserRangeInsideBlockedRange = !positionInUserRange && positionInBlockedRange;
    const isOnUserRangeStartOrEnd = positionInUserRange === 'first' || positionInUserRange === 'last';

    const inputId = 'input-radio' + dateString + monthPosition;

    const dayDescription_Memo = useMemo(() => description && generateDayDescription(dateString, description), [dateString, description]);

    return (
        <div
            className={classNames(
                '[--month-view-has-outer-left-edge:0] [--month-view-has-outer-right-edge:0] [--month-view-top-is-inner-horiz-edge:0] nth-[7n]:[--month-view-has-outer-right-edge:1] nth-[7n+1]:[--month-view-has-outer-left-edge:1] nth-[n+15]:[--month-view-top-is-inner-horiz-edge:1]',
                'group relative h-(--calendar-grid-cell-height) w-(--calendar-grid-cell-width) select-none',
                monthPosition === 'currentMonth' ? 'bg-white' : 'bg-neutral-100',
            )}
        >
            {/* Gridlines */}
            <div className="absolute top-0 left-0 box-content size-full border-t-[calc(theme(spacing.px)*var(--month-view-top-is-inner-horiz-edge))] border-l-[calc(theme(spacing.px)*(1-var(--month-view-has-outer-left-edge)))] border-neutral-100" />

            {isInBlockedRange && (
                <>
                    <input
                        id={inputId}
                        type="radio"
                        tabIndex={0}
                        name="calender-days-input-radio-name"
                        className="peer absolute size-full [clip-path:rect(0_0_0_0)]" // retain selectability / accessability
                        onChange={(ev) => ev.currentTarget.checked && store_setDateDetails(true)}
                    />

                    {/* Blocked-Range Cell (School Holidays) */}
                    <div
                        className={classNames(
                            'absolute top-1.5 right-[calc(--spacing(1)*var(--month-view-has-outer-right-edge))] bottom-1.5 left-[calc(--spacing(1)*var(--month-view-has-outer-left-edge))] rounded-l-[calc(4px*var(--month-view-has-outer-left-edge))] rounded-r-[calc(4px*var(--month-view-has-outer-right-edge))]',
                            monthPosition === 'currentMonth'
                                ? isInUserRange
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

                    {/* Pop up date information */}
                    <div className="text-2xs duration-theme border-theme-accent absolute top-1/2 left-1/2 z-30 h-auto w-auto origin-top-left scale-x-0 scale-y-50 rounded-xs border bg-white p-1 pb-0.5 text-left font-mono leading-tight whitespace-pre capitalize opacity-10 transition-[opacity,scale] peer-checked:scale-100 peer-checked:opacity-100">
                        {dayDescription_Memo}
                    </div>
                </>
            )}

            {/* User-Range start- and endpoints */}
            <div
                className={classNames(
                    'bg-theme-cta-background after:bg-theme-accent outline-theme-accent absolute top-[-5%] left-1/2 z-10 aspect-square h-[110%] -translate-x-1/2 rounded-full outline-5 -outline-offset-1 after:absolute after:top-[12%] after:bottom-[12%] after:-z-10', //
                    isOnUserRangeStartOrEnd
                        ? positionInUserRange === 'first'
                            ? 'after:-right-1/2 after:left-1/2 after:[clip-path:polygon(50%_0%,90%_50%,50%_100%)]'
                            : 'after:right-1/2 after:-left-1/2 after:[clip-path:polygon(50%_0%,10%_50%,50%_100%)]'
                        : 'hidden',
                )}
            />

            {/* Date */}
            <label
                htmlFor={isInBlockedRange ? inputId : undefined}
                className={classNames(
                    'absolute top-0 left-0 z-20 flex size-full items-center justify-center font-light transition-[color]',
                    'peer-checked:after:bg-theme-accent after:border-theme-accent after:absolute after:top-0 after:mx-auto after:aspect-square after:h-full after:rounded-full after:border-2 after:opacity-0 after:transition-opacity peer-checked:after:opacity-100 peer-focus:after:opacity-100 hover:after:opacity-100',
                    isInBlockedRange && 'pointer-events-auto cursor-pointer hover:text-neutral-200',
                    monthPosition === 'currentMonth'
                        ? isOutsideUserRangeInsideBlockedRange
                            ? 'text-theme-blocked-range-active-holiday-school'
                            : isOnUserRangeStartOrEnd
                              ? 'text-theme-cta-foreground text-base! font-normal!'
                              : isInBlockedRange
                                ? 'pointer-events-auto cursor-pointer text-red-600'
                                : 'text-green-600'
                        : 'text-neutral-400',
                )}
            >
                {date}
            </label>
        </div>
    );
};

export default CalendarDay;

function generateDayDescription(dateString: string, dayDescription: MapValue<RangeDays>) {
    let descriptionString = dateString + '\n';
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
