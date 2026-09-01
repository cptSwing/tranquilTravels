import { classNames } from 'cpts-javascript-utilities';
import { DayCellData, MapValue, RangeDays, RangePosition } from '../types/types';
import config from '../config/config.json';
import { useZustandStore } from '../hooks/useZustandStore';
import { useMemo, useState } from 'preact/compat';

const store_setDateDetails = useZustandStore.getState().methods.store_setDateDetails;

const CalendarDay = ({
    dayCell,
    positionInUserRange,
    positionInBlockedRangeSchool,
    positionInBlockedRangePublic,
    descriptions,
}: {
    dayCell: DayCellData;
    positionInUserRange: RangePosition;
    positionInBlockedRangeSchool: RangePosition | undefined;
    positionInBlockedRangePublic: RangePosition | undefined;
    descriptions: MapValue<RangeDays> | undefined;
}) => {
    const { day, monthPosition, dateString } = dayCell;
    const isInUserRange = !!positionInUserRange;
    const isOnUserRangeStartOrEnd = positionInUserRange === 'first' || positionInUserRange === 'last';

    const isInBlockedRangeSchool = !!positionInBlockedRangeSchool;
    const isInBlockedRangePublic = !!positionInBlockedRangePublic;

    const isOutsideUserRangeInsideBlockedRangeSchool = !positionInUserRange && positionInBlockedRangeSchool;
    const isOutsideUserRangeInsideBlockedRangePublic = !positionInUserRange && positionInBlockedRangePublic;

    const inputId = `input-radio_${dateString}_${monthPosition}`;

    const dayDescription_Memo = useMemo(() => descriptions && generateDayDescription(dateString, descriptions), [dateString, descriptions]);

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

            {(isInBlockedRangeSchool || isInBlockedRangePublic) && (
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
                    {positionInBlockedRangeSchool && (
                        <div
                            className={classNames(
                                'absolute top-2.25 right-[calc(--spacing(0.75)*var(--month-view-has-outer-right-edge))] bottom-2.25 left-[calc(--spacing(0.75)*var(--month-view-has-outer-left-edge))] rounded-l-[calc(3px*var(--month-view-has-outer-left-edge))] rounded-r-[calc(3px*var(--month-view-has-outer-right-edge))]',
                                monthPosition === 'currentMonth'
                                    ? isInUserRange
                                        ? positionInUserRange === 'first'
                                            ? 'to-theme-blocked-range-active-holiday-school from-theme-blocked-range-inactive-holiday-school bg-linear-to-r'
                                            : positionInUserRange === 'last'
                                              ? 'to-theme-blocked-range-active-holiday-school from-theme-blocked-range-inactive-holiday-school bg-linear-to-l'
                                              : // 'middle' or 'single'
                                                'bg-theme-blocked-range-active-holiday-school'
                                        : 'bg-theme-blocked-range-inactive-holiday-school'
                                    : 'border-theme-blocked-range-inactive-holiday-school bg-theme-blocked-range-inactive-holiday-school/20 border-t border-r-[calc(1px*var(--month-view-has-outer-right-edge))] border-b border-l-[calc(1px*var(--month-view-has-outer-left-edge))]',
                                positionInBlockedRangeSchool === 'first'
                                    ? '[--month-view-has-outer-left-edge:1]'
                                    : positionInBlockedRangeSchool === 'last'
                                      ? '[--month-view-has-outer-right-edge:1]'
                                      : positionInBlockedRangeSchool === 'single'
                                        ? '[--month-view-has-outer-left-edge:1] [--month-view-has-outer-right-edge:1]'
                                        : '',
                            )}
                        />
                    )}

                    {/* Blocked-Range Cell (Public Holidays) */}
                    {positionInBlockedRangePublic && (
                        <div
                            className={classNames(
                                'absolute top-1.5 right-[calc(--spacing(2)*var(--month-view-has-outer-right-edge))] bottom-1.5 left-[calc(--spacing(2)*var(--month-view-has-outer-left-edge))] rounded-l-[calc(3px*var(--month-view-has-outer-left-edge))] rounded-r-[calc(3px*var(--month-view-has-outer-right-edge))]',
                                monthPosition === 'currentMonth'
                                    ? isInUserRange
                                        ? positionInUserRange === 'first'
                                            ? 'to-theme-blocked-range-active-holiday-public from-theme-blocked-range-inactive-holiday-public bg-linear-to-r'
                                            : positionInUserRange === 'last'
                                              ? 'to-theme-blocked-range-active-holiday-public from-theme-blocked-range-inactive-holiday-public bg-linear-to-l'
                                              : // 'middle' or 'single'
                                                'bg-theme-blocked-range-active-holiday-public outline-theme-blocked-range-active-holiday-school outline-2 -outline-offset-1'
                                        : 'bg-theme-blocked-range-inactive-holiday-public'
                                    : 'border-theme-blocked-range-inactive-holiday-public bg-theme-blocked-range-inactive-holiday-public/40 border-t border-r-[calc(1px*var(--month-view-has-outer-right-edge))] border-b border-l-[calc(1px*var(--month-view-has-outer-left-edge))]',
                                positionInBlockedRangePublic === 'first'
                                    ? '[--month-view-has-outer-left-edge:1]'
                                    : positionInBlockedRangePublic === 'last'
                                      ? '[--month-view-has-outer-right-edge:1]'
                                      : positionInBlockedRangePublic === 'single'
                                        ? '[--month-view-has-outer-left-edge:1] [--month-view-has-outer-right-edge:1]'
                                        : '',
                            )}
                        />
                    )}

                    {/* Pop up date information */}
                    {dayDescription_Memo && <DateInformationPopup dateInformation={dayDescription_Memo} />}
                </>
            )}

            {/* User-Range start- and endpoints */}
            <div
                className={classNames(
                    'bg-theme-cta-background outline-theme-accent absolute top-0.5 bottom-0.5 left-1/2 z-10 aspect-square -translate-x-1/2 rounded-full outline-5 -outline-offset-1 drop-shadow-xs',
                    'after:bg-theme-accent after:absolute after:top-0 after:bottom-0',
                    isOnUserRangeStartOrEnd
                        ? positionInUserRange === 'first'
                            ? 'after:-right-1/2 after:left-1/2 after:[clip-path:polygon(35%_0%,75%_40%,90%_50%,75%_60%,35%_100%,60%_50%)]'
                            : 'after:right-1/2 after:-left-1/2 after:[clip-path:polygon(65%_0%,25%_40%,10%_50%,25%_60%,65%_100%,40%_50%)]'
                        : 'hidden',
                )}
            />

            {/* Date, as well as circle for Pop-Up */}
            <label
                htmlFor={isInBlockedRangeSchool || isInBlockedRangePublic ? inputId : undefined}
                className={classNames(
                    'absolute top-0 left-0 z-20 flex size-full items-center justify-center',
                    (isInBlockedRangeSchool || isInBlockedRangePublic) && 'hover:text-theme-text-light pointer-events-auto cursor-pointer',
                    monthPosition === 'currentMonth'
                        ? isOnUserRangeStartOrEnd
                            ? 'text-theme-text-light text-base! italic'
                            : isOutsideUserRangeInsideBlockedRangePublic
                              ? 'text-theme-blocked-range-active-holiday-public'
                              : isOutsideUserRangeInsideBlockedRangeSchool
                                ? 'text-theme-blocked-range-active-holiday-school'
                                : isInBlockedRangePublic
                                  ? 'text-cyan-600'
                                  : isInBlockedRangeSchool
                                    ? 'text-red-600'
                                    : 'text-green-600'
                        : 'text-neutral-400',
                )}
            >
                {day}
            </label>
        </div>
    );
};

export default CalendarDay;

const DateInformationPopup = ({ dateInformation }: { dateInformation: string }) => {
    const [isTooWide, setIsTooWide] = useState(false);

    return (
        <div
            className={classNames(
                'peer-checked:duration-theme border-theme-cta-foreground absolute top-1/2 z-30 size-auto max-w-dvw scale-x-0 scale-y-50 rounded-xs border bg-white p-1 pb-0.5 text-left font-mono text-xs leading-tight whitespace-pre capitalize opacity-0 shadow transition-[opacity,scale] duration-100 peer-checked:scale-100 peer-checked:opacity-100',
                'peer-checked:before:bg-theme-cta-foreground before:duration-theme before:absolute before:top-[calc(-0.5*var(--calendar-grid-cell-height))] before:size-(--calendar-grid-cell-height) before:scale-10 before:rounded-full before:opacity-0 before:transition-[scale,opacity] before:[clip-path:polygon(0_0,100%_0,100%_40%,40%_40%,40%_100%,0_100%)] peer-checked:before:scale-100 peer-checked:before:opacity-40',
                isTooWide
                    ? 'left-[calc(50%-var(--element-offset-width))] origin-top-right before:left-[calc(-0.5*var(--calendar-grid-cell-height)+var(--element-offset-width))] before:rotate-90'
                    : 'left-1/2 origin-top-left before:left-[calc(-0.5*var(--calendar-grid-cell-height))]',
            )}
            onTransitionStart={(ev) => {
                const offsetWidth = ev.currentTarget.offsetWidth;
                const rectLeft = ev.currentTarget.getBoundingClientRect().left;
                const windowWidth = window.innerWidth;

                if (rectLeft + offsetWidth >= windowWidth) {
                    setIsTooWide(true);
                    ev.currentTarget.style.setProperty('--element-offset-width', `${offsetWidth}px`);
                } else {
                    setIsTooWide(false);
                    ev.currentTarget.style.removeProperty('--element-offset-width');
                }
            }}
        >
            {dateInformation}
        </div>
    );
};

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
