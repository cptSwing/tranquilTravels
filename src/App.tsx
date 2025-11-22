import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import Calendar from './components/Calendar';
import Header from './components/Header';
import RangeDescription from './components/RangeDescription';
import Options from './components/Options';
import Debug from './components/Debug';
import config from './config/config.json';

const App = () => (
    <QueryClientProvider client={queryClientTanstack}>
        <Header />

        <main className="mx-auto flex w-(--content-width) flex-col items-center justify-start gap-y-2 py-2 [--main-elements-padding:--spacing(3)]">
            <Todo />

            <Options />
            <RangeDescription />
            <Calendar />

            {config.debug && (
                <div className="bg-neutral-500 p-2">
                    <Debug />
                </div>
            )}

            <Thanks />
        </main>
    </QueryClientProvider>
);
export default App;

const Todo = () => {
    return (
        <div className="mt-1 mb-3 text-neutral-500">
            <h5 className="mb-1 italic">Todo:</h5>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-5 text-xs">
                <li className="list-disc">Fix dropdown (&quot;Choose Countries&quot;) only working after 1,2 clicks</li>
                <li className="list-disc">Make &quot;Choose Holiday Type&quot; actually do anything</li>
                <li className="list-disc">Cursor-pointer; Text fixes (&apos;Assignees&apos; etc)</li>
                <li className="list-disc">Fix Option&apos;s elements not growing on large desktop sizes</li>
                <li className="list-disc">Add England, Russia, US, Canada (find another API, fun)</li>
                <li className="list-disc">Finish up &apos;thank-you&apos; list</li>
                <li className="list-disc">Beat down any re-renders on pre-existing calendar ranges, the eternal WIP</li>
            </ul>
        </div>
    );
};

const Thanks = () => {
    return (
        <div className="my-2 flex flex-col items-center justify-start text-neutral-400">
            <h6 className="mb-2 italic">Thanks to</h6>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div className="list-disc">OpenHolidays API</div>
                <div className="list-disc">headlessui</div>
                <div className="list-disc">heroicons</div>
                <div className="list-disc">zustand</div>
                <div className="list-disc">
                    fredley (eck chair from{' '}
                    <a href="https://thenounproject.com/browse/icons/term/deck-chair/" target="_blank" rel="noreferrer">
                        Noun Project
                    </a>
                    )
                </div>
                <div className="list-disc">openapi-react-query</div>
            </div>
        </div>
    );
};
