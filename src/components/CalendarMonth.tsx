import useOutsideClick from '../hooks/useOutsideClick';
import { isInRange } from '../lib/handleDates';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { MonthData, DateRange, RangePosition } from '../types/types';
import CalendarDay from './CalendarDay';
import { useZustandStore } from '../lib/zustandStore';

const store_setDateDetails = useZustandStore.getState().methods.store_setDateDetails;

const CalendarMonth = ({ monthData, userRange, blockedRanges }: { monthData: MonthData; userRange: DateRange; blockedRanges?: DateRange[] | undefined }) => {
    const { monthIndex, year, cells } = monthData;
    const outsideClick_Ref = useOutsideClick<HTMLDivElement>(() => store_setDateDetails(false));

    return (
        <div>
            <h5 className="text-theme-accent mb-1.5 inline-block pl-1.5 text-left font-serif leading-none">
                {MONTH_NAMES[monthIndex]} {year}
            </h5>

            <div className="level-2 grid grid-cols-7">
                <WeekdayNames />

                <div ref={outsideClick_Ref} className="contents">
                    {cells.map((cell) => {
                        const positionInUserRange = getPositionInRange(cell.dateString, userRange.startDate, userRange.endDate);
                        const blockedRange = blockedRanges?.find((r) => isInRange(cell.dateString, r.startDate, r.endDate)); // TODO could pre-filter per-month? compare cell[0] and cell[length-1] datestrings?
                        const positionInBlockedRange = blockedRange && getPositionInRange(cell.dateString, blockedRange.startDate, blockedRange.endDate);
                        const dayDescription = blockedRange?.dailyDescriptions && blockedRange.dailyDescriptions.get(cell.dateString);

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
        </div>
    );
};

export default CalendarMonth;

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
