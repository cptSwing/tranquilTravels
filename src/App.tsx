import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OpenApiQueryTest from './components/OpenApiQueryTest';

const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const App = () => (
    <QueryClientProvider client={reactQueryClient}>
        <div className="h-dvh w-dvw [--header-height:theme(spacing.24)]">
            <header className="fixed top-0 right-0 left-0 flex h-[var(--header-height)] flex-col items-center justify-between bg-red-700 pt-8 pb-2">
                <div>Tranquil Travels</div>
                <div className="flex items-start justify-start gap-x-2">
                    <div>Item 1</div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                </div>
            </header>

            <main className="absolute top-[var(--header-height)] flex w-full flex-col gap-y-2 bg-green-600 p-2">
                <div className="flex justify-around gap-x-2">
                    <div className="bg-gray-500 p-2">
                        <h4>Pick Travel Dates</h4>
                        <div className="h-24 py-8">(calendar)</div>
                    </div>

                    <div className="bg-gray-500 p-2">
                        <h4>Pick Countries to Query</h4>
                        <div className="h-24 py-8">(list)</div>
                    </div>
                </div>

                <div className="bg-gray-500 p-2">
                    <h5>Results</h5>
                </div>

                <div className="bg-gray-500 p-2">
                    <OpenApiQueryTest />
                </div>
            </main>
        </div>
    </QueryClientProvider>
);
export default App;
