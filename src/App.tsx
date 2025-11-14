import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import ChooseCountries from './components/ChooseCountries';
import SchoolHolidays from './components/SchoolHolidays';
import ChooseDateRange from './components/ChooseDateRange';
import ResultsByMonth from './components/ResultsByMonth';

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
                    <ResultsByMonth />
                </div>

                <div className="bg-neutral-500 p-2">
                    <SchoolHolidays />
                </div>
            </main>
        </QueryClientProvider>
    </div>
);
export default App;
