import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import ChooseCountries from './components/ChooseCountries';
import ChooseDateRange from './components/ChooseDateRange';
import ResultsByMonth from './components/ResultsByMonth';
import Header from './components/Header';

const App = () => (
    <div className="h-dvh w-dvw overflow-x-hidden bg-neutral-500 [--header-height:--spacing(24)]">
        <Header />

        <QueryClientProvider client={queryClientTanstack}>
            <main className="mx-auto mt-4 w-[90%] md:w-4/5">
                <div className="mx-auto flex w-fit justify-center gap-x-4 bg-teal-400 p-2">
                    <ChooseDateRange />
                    <ChooseCountries />
                </div>

                <div className="mt-4 p-2">
                    <ResultsByMonth />
                </div>

                {/* <div className="bg-neutral-500 p-2">
                    <DebugHolidayView />
                </div> */}
            </main>
        </QueryClientProvider>
    </div>
);
export default App;
