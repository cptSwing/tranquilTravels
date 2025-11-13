import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import ChooseCountry from './components/ChooseCountry';
import SchoolHolidays from './components/SchoolHolidays';
import ChooseTravelDates from './components/ChooseTravelDates';
import { useZustandStore } from './lib/zustandStore';
import { useMemo } from 'react';
import { WEEKDAYS } from './types/enums';

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
                    <div className="bg-gray-500 p-2">
                        <h4>Pick Travel Dates</h4>
                        <div className="h-24 py-8">
                            <ChooseTravelDates />
                        </div>
                    </div>

                    <div className="bg-gray-500 p-2">
                        <h4>Pick Countries to Query</h4>
                        <div className="h-24 py-8">
                            <ChooseCountry />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-500 p-2">
                    <Months />
                </div>

                <div className="bg-gray-500 p-2">
                    <SchoolHolidays />
                </div>
            </main>
        </QueryClientProvider>
    </div>
);
export default App;

const Months = () => {
    const { from, to } = useZustandStore((store) => store.values.travelDates);

    const dates = useMemo(() => {
        if (from && to) {
            const starting = new Date(from);

            const startingDate = starting.getDate();
            const startingMonth = starting.getMonth();
            const startingYear = starting.getFullYear();
            const startingFirstWeekdayOfMonth = new Date(startingYear, startingMonth).getDay();
            // TODO ^ can use starting.getDay() and go back to first of month, cycling to correct weekday??

            const ending = new Date(to);

            const endingDate = ending.getDate();
            const endingMonth = ending.getMonth();
            const endingYear = ending.getFullYear();
            const endingFirstWeekdayOfMonth = new Date(endingYear, endingMonth).getDay();

            return {
                start: {
                    day: startingDate,
                    month: startingMonth,
                    year: startingYear,
                    firstWeekDay: startingFirstWeekdayOfMonth,
                },
                end: {
                    day: endingDate,
                    month: endingMonth,
                    year: endingYear,
                    firstWeekDay: endingFirstWeekdayOfMonth,
                },
            };
        }
    }, [from, to]);

    return dates ? (
        <div className="grid grid-cols-5 gap-2">
            <div className="bg-neutral-300 p-2 text-center">
                {dates.start.month + 1}/{dates.start.year}
                <div className="grid grid-cols-7">
                    <Weekdays />
                    <StartMonth date={dates.start} />
                </div>
            </div>

            <div className="bg-neutral-300 p-2 text-center">
                {dates.end.month + 1}/{dates.end.year}
                <div className="grid grid-cols-7">
                    <Weekdays />
                    <EndMonth date={dates.end} />
                </div>
            </div>
        </div>
    ) : null;
};

const StartMonth = ({
    date,
}: {
    date: {
        day: number;
        month: number;
        year: number;
        firstWeekDay: number;
    };
}) => {
    const { day, month, year, firstWeekDay } = date;

    const paintedDays = Array.from({ length: daysInMonth(month, year) }).map((_, idx) => (
        <div key={idx} className="text-center" style={{ backgroundColor: idx + 1 >= day ? 'yellow' : undefined }}>
            {idx + 1}
        </div>
    ));

    paintedDays.unshift(...Array.from({ length: firstWeekDay }).map((_, idx) => <div key={'empty' + idx}> </div>));

    return paintedDays;
};

const EndMonth = ({
    date,
}: {
    date: {
        day: number;
        month: number;
        year: number;
        firstWeekDay: number;
    };
}) => {
    const { day, month, year, firstWeekDay } = date;

    const paintedDays = Array.from({ length: daysInMonth(month, year) }).map((_, idx) => (
        <div key={idx} className="text-center" style={{ backgroundColor: idx + 1 <= day ? 'yellow' : undefined }}>
            {idx + 1}
        </div>
    ));

    paintedDays.unshift(...Array.from({ length: firstWeekDay }).map((_, idx) => <div key={'empty' + idx}> </div>));

    return paintedDays;
};

const Weekdays = () =>
    Object.keys(WEEKDAYS)
        .slice(7)
        .map((enumWeekday, idx) => (
            <div key={idx} className="text-center">
                {enumWeekday}
            </div>
        ));

// https://stackoverflow.com/a/315767
function daysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
}
