import useOutsideClick from '../hooks/useOutsideClick';
import { isInRange } from '../lib/handleDates';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { MonthData, DateRange, RangePosition, DayByCountries } from '../types/types';
import CalendarDay from './CalendarDay';
import { useZustandStore } from '../lib/zustandStore';
import { union } from '../lib/mapOperations';

const store_setDateDetails = useZustandStore.getState().methods.store_setDateDetails;

const CalendarMonth = ({
    monthData,
    userRange,
    blockedRangesSchool,
    blockedRangesPublic,
}: {
    monthData: MonthData;
    userRange: Omit<DateRange, 'dailyDescriptions'>;
    blockedRangesSchool?: DateRange[];
    blockedRangesPublic?: DateRange[];
}) => {
    const { monthIndex, year, cells } = monthData;
    const outsideClick_Ref = useOutsideClick<HTMLDivElement>(() => store_setDateDetails(false));

    return (
        <div>
            <h5 className="text-theme-cta-foreground mb-2 inline-block pl-1.5 text-left font-serif leading-none">
                {MONTH_NAMES[monthIndex]} {year}
            </h5>

            <div className="level-2 grid grid-cols-7">
                <WeekdayNames />

                <div ref={outsideClick_Ref} className="contents">
                    {cells.map((cell) => {
                        const positionInUserRange = getPositionInRange(cell.dateString, userRange.startDate, userRange.endDate);

                        const blockedRangeSchool = blockedRangesSchool?.find((r) => isInRange(cell.dateString, r.startDate, r.endDate));
                        const positionInBlockedRangeSchool =
                            blockedRangeSchool && getPositionInRange(cell.dateString, blockedRangeSchool.startDate, blockedRangeSchool.endDate);

                        const blockedRangePublic = blockedRangesPublic?.find((r) => isInRange(cell.dateString, r.startDate, r.endDate));
                        const positionInBlockedRangePublic =
                            blockedRangePublic && getPositionInRange(cell.dateString, blockedRangePublic.startDate, blockedRangePublic.endDate);

                        let dayDescription: DayByCountries | undefined;
                        if (blockedRangePublic && blockedRangeSchool) {
                            dayDescription = mergeDayDescriptions([
                                blockedRangePublic.dailyDescriptions.get(cell.dateString),
                                blockedRangeSchool.dailyDescriptions.get(cell.dateString),
                            ]);
                        } else if (blockedRangeSchool) {
                            dayDescription = blockedRangeSchool.dailyDescriptions.get(cell.dateString);
                        } else if (blockedRangePublic) {
                            dayDescription = blockedRangePublic.dailyDescriptions.get(cell.dateString);
                        }

                        // cell.dateString === '2025-11-19' && console.log('%c[CalendarDay]', 'color: #c699f8', `dayDescription :`, dayDescription);

                        return (
                            <CalendarDay
                                key={cell.dateString}
                                dayCell={cell}
                                positionInUserRange={positionInUserRange}
                                positionInBlockedRangeSchool={positionInBlockedRangeSchool}
                                positionInBlockedRangePublic={positionInBlockedRangePublic}
                                descriptions={dayDescription}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarMonth;

const WeekdayNames = () =>
    WEEKDAY_NAMES.map((weekDayName, idx) => (
        <div
            key={weekDayName + idx}
            className="text-2xs text-theme-text-dark w-(--calendar-grid-cell-width) border-b border-b-neutral-200 pt-0.5 pb-1 text-center uppercase select-none first-letter:text-xs first-letter:select-none"
        >
            {weekDayName}
        </div>
    ));

function getPositionInRange(date: string, rangeStart: string, rangeEnd: string): RangePosition {
    if (date < rangeStart || date > rangeEnd) return null;
    return date === rangeStart && date === rangeEnd ? 'single' : date === rangeStart ? 'first' : date === rangeEnd ? 'last' : 'middle';
}

function mergeDayDescriptions([dayDescription1, dayDescription2]: [DayByCountries | undefined, DayByCountries | undefined]) {
    if (!dayDescription1 || !dayDescription2) return undefined;
    const unioned = union(dayDescription1, dayDescription2);

    return unioned as DayByCountries;
}
