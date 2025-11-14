import { useZustandStore } from '../lib/zustandStore';
import { classNames } from 'cpts-javascript-utilities';
import { Fragment, useMemo } from 'react';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../types/consts';
import { MonthData } from '../types/types';

const ResultsByMonth = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const monthsData: MonthData[] | undefined = useMemo(() => {
        if (from && to) {
            const starting = new Date(from.year, from.monthIndex, from.date); // Example - for the following comments: "2025-02-25"
            const startingDay = starting.getDay(); // 2 (was a Tuesday, 0-based, starts on Sunday)
            const startingFirstWeekdayOfMonth = (startingDay - ((from.date - 1) % 7) + 7) % 7;

            const ending = new Date(to.year, to.monthIndex, to.date);
            const endingDay = ending.getDay();
            const endingFirstWeekdayOfMonth = (endingDay - ((to.date - 1) % 7) + 7) % 7;

            const monthDates: MonthData[] = [];
            const monthsDifference = (to.monthIndex - (from.monthIndex % 12) + 12) % 12; // WARN bugs out at 12+ months, but should suffice

            for (let i = 0; i < monthsDifference + 1; i++) {
                const monthStep = (from.monthIndex + i) % 12;
                const yearStep = monthStep < from.monthIndex ? from.year + 1 : from.year;
                const daysInMonth = getDaysInMonth(monthStep, yearStep);

                let date, month, year, firstWeekDay;
                if (i === 0) {
                    date = from.date;
                    month = from.monthIndex;
                    year = from.year;
                    firstWeekDay = startingFirstWeekdayOfMonth;
                } else if (i === monthsDifference) {
                    date = to.date;
                    month = to.monthIndex;
                    year = to.year;
                    firstWeekDay = endingFirstWeekdayOfMonth;
                } else {
                    const previousMonth = monthDates[i - 1];

                    date = 0;
                    month = monthStep;
                    year = yearStep;
                    firstWeekDay = (previousMonth.firstWeekDay + previousMonth.daysInMonth) % 7;
                }

                monthDates.push({
                    date,
                    month,
                    year,
                    daysInMonth,
                    firstWeekDay,
                });
            }

            return monthDates;
        }
    }, [from, to]);

    return monthsData ? (
        <div className="grid grid-cols-4 gap-2">
            {monthsData.map((monthData, idx, arr) => {
                const monthPosition = idx === 0 ? 'first' : idx === arr.length - 1 ? 'last' : 'middle';
                return <MonthlyView key={monthPosition + idx} monthData={monthData} monthPosition={monthPosition} />;
            })}
        </div>
    ) : null;
};

export default ResultsByMonth;

const MonthlyView = ({ monthData, monthPosition }: { monthData: MonthData; monthPosition: 'first' | 'middle' | 'last' }) => {
    const { date, month, year, daysInMonth, firstWeekDay } = monthData;

    const paintedDayElements_Memo = useMemo(() => {
        const paintedDayElements = Array.from({ length: daysInMonth }).map((_, idx) => (
            <div key={idx} className="relative z-0 bg-neutral-200">
                <div
                    className={classNames(
                        'absolute top-0 left-0 -z-10 h-full w-full',
                        monthPosition === 'first'
                            ? idx + 1 >= date
                                ? 'bg-yellow-300'
                                : ''
                            : monthPosition === 'last'
                              ? idx + 1 <= date
                                  ? 'bg-yellow-300'
                                  : ''
                              : // monthPosition === 'middle'
                                'bg-yellow-300',
                    )}
                />
                <span className="text-center text-black">{idx + 1}</span>
            </div>
        ));

        // Add empty cells to display calendar dates at correct starting weekday:
        paintedDayElements.unshift(...Array.from({ length: firstWeekDay }).map((_, idx) => <div key={idx}> </div>));
        return paintedDayElements;
    }, [date, firstWeekDay, daysInMonth, monthPosition]);

    return (
        <div className="rounded-xs bg-neutral-300 p-2 text-center shadow-md">
            {MONTH_NAMES[month]} {year}
            <div className="grid grid-cols-7">
                <WeekdayNames />
                {paintedDayElements_Memo.map((elem, idx) => (
                    <Fragment key={idx}>{elem}</Fragment>
                ))}
            </div>
        </div>
    );
};

const WeekdayNames = () =>
    WEEKDAY_NAMES.map((weekDayName, idx) => (
        <div key={weekDayName + idx} className="text-center">
            {weekDayName}
        </div>
    ));

// https://stackoverflow.com/a/315767 - skips to next month and by picking date 0, wraps back to last date of previous month
function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
}
