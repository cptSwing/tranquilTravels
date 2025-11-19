import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import ChooseCountries from './components/ChooseCountries';
import ChooseDateRange from './components/ChooseDateRange';
import ResultsByMonth from './components/ResultsByMonth';
import Header from './components/Header';
import RangeDescription from './components/RangeDescription';

const App = () => (
    <div className="bg-theme-background h-dvh w-dvw overflow-x-hidden [--header-height:--spacing(24)]">
        <QueryClientProvider client={queryClientTanstack}>
            <Header />

            <main className="mx-auto flex w-[90%] flex-col items-center justify-start gap-y-2 pt-2 md:w-4/5">
                <div className="level-1 mx-auto flex w-fit justify-center gap-x-4 p-2">
                    <ChooseDateRange />
                    <ChooseCountries />
                </div>

                <RangeDescription />

                <ResultsByMonth />

                {/* <div className="bg-neutral-500 p-2">
                    <DebugHolidayView />
                </div> */}
            </main>
        </QueryClientProvider>
    </div>
);
export default App;
