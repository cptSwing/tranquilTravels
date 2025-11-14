import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import ChooseCountries from './components/ChooseCountries';
import SchoolHolidays from './components/SchoolHolidays';
import ChooseDateRange from './components/ChooseDateRange';
import { useZustandStore } from './lib/zustandStore';
import { classNames } from 'cpts-javascript-utilities';
import { Fragment, useMemo } from 'react';
import { WEEKDAY } from './types/consts';
import { MonthData } from './types/types';

const App = () => (
    <div className="h-dvh w-dvw [--header-height:--spacing(24)]">
        <header className="fixed top-0 right-0 left-0 flex h-(--header-height) flex-col items-center justify-between bg-red-700 pt-8 pb-2">
            <div>Tranquil Travels</div>
            <div className="flex items-start justify-start gap-x-2">
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </div>
        </header>

        <QueryClientProvider client={queryClientTanstack}>
            <main className="absolute top-(--header-height) flex w-full flex-col gap-y-2 bg-green-600 p-2">
                <div className="flex justify-around gap-x-2">
                    <ChooseDateRange />
                    <ChooseCountries />
                </div>

                <div className="bg-neutral-500 p-2">
                    <Months />
                </div>

                <div className="bg-neutral-500 p-2">
                    <SchoolHolidays />
                </div>
            </main>
        </QueryClientProvider>
    </div>
);
export default App;

const Months = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    const monthsData: MonthData[] | undefined = useMemo(() => {
        if (from && to) {
            // Example: 2025-02-25
            const starting = new Date(from);
            const startingDate = starting.getDate(); // 25
            const startingDay = starting.getDay(); // 2 (was a Tuesday, 0-based, starts on Sunday)
            const startingMonth = starting.getMonth(); // 1 (0-based index)
            const startingYear = starting.getFullYear(); // 2025
            const startingFirstWeekdayOfMonth = (startingDay - ((startingDate - 1) % 7) + 7) % 7;

            const ending = new Date(to);
            const endingDate = ending.getDate();
            const endingDay = ending.getDay();
            const endingMonth = ending.getMonth();
            const endingYear = ending.getFullYear();
            const endingFirstWeekdayOfMonth = (endingDay - ((endingDate - 1) % 7) + 7) % 7;

            const monthsBetween = (endingMonth - (startingMonth % 12) + 12) % 12; // WARN bugs out at 12+ months, but should suffice

            const monthDates = Array.from({ length: monthsBetween + 1 }).map((_, idx, arr) => {
                if (idx === 0) {
                    return {
                        date: startingDate,
                        month: startingMonth,
                        year: startingYear,
                        firstWeekDay: startingFirstWeekdayOfMonth,
                    };
                } else if (idx === arr.length - 1) {
                    return {
                        date: endingDate,
                        month: endingMonth,
                        year: endingYear,
                        firstWeekDay: endingFirstWeekdayOfMonth,
                    };
                }

                const monthStep = (startingMonth + idx) % 12;
                return {
                    date: 0,
                    month: monthStep,
                    year: monthStep < startingMonth ? startingYear + 1 : startingYear,
                    firstWeekDay: startingFirstWeekdayOfMonth,
                };
            });

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

const MonthlyView = ({ monthData, monthPosition }: { monthData: MonthData; monthPosition: 'first' | 'middle' | 'last' }) => {
    const { date, month, year, firstWeekDay } = monthData;

    const paintedDayElements_Memo = useMemo(() => {
        const paintedDayElements = Array.from({ length: daysInMonth(month, year) }).map((_, idx) => (
            <div
                key={idx}
                className={classNames(
                    'text-center',
                    monthPosition === 'first'
                        ? idx + 1 >= date
                            ? 'bg-yellow-300'
                            : 'bg-neutral-200'
                        : monthPosition === 'last'
                          ? idx + 1 <= date
                              ? 'bg-yellow-300'
                              : 'bg-neutral-200'
                          : // monthPosition === 'middle'
                            'bg-yellow-300',
                )}
            >
                {idx + 1}
            </div>
        ));

        // Add empty cells to display calendar dates at correct starting weekday:
        paintedDayElements.unshift(...Array.from({ length: firstWeekDay }).map((_, idx) => <div key={idx}> </div>));
        return paintedDayElements;
    }, [date, firstWeekDay, month, monthPosition, year]);

    return (
        <div className="rounded-xs bg-neutral-300 p-2 text-center shadow-md">
            {monthData.month + 1}/{monthData.year}
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
    WEEKDAY.map((constWeekday, idx) => (
        <div key={constWeekday + idx} className="text-center">
            {constWeekday}
        </div>
    ));

// https://stackoverflow.com/a/315767 - skips to next month and by picking date 0, wraps back to last date of previous month
function daysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
}
