import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import Calendar from './components/Calendar';
import Header from './components/Header';
import RangeDescription from './components/RangeDescription';
import Options from './components/Options';
import Debug from './components/Debug';
import config from './config/config.json';
import Acknowledgements from './components/Acknowledgements';

const App = () => (
    <QueryClientProvider client={queryClientTanstack}>
        <Header />

        <main className="mx-auto mt-6 mb-4 flex w-(--content-width) flex-col items-center justify-start gap-y-2 [--main-elements-padding:--spacing(3)]">
            <Options />
            <RangeDescription />
            <Calendar />

            {config.debug && (
                <div className="bg-neutral-500 p-2">
                    <Debug />
                </div>
            )}

            <Acknowledgements />
        </main>
    </QueryClientProvider>
);
export default App;
