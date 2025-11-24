import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientTanstack } from './lib/api';
import Header from './components/Header';
import Main from './components/Main';

const App = () => (
    <QueryClientProvider client={queryClientTanstack}>
        <Header />

        <Main />
    </QueryClientProvider>
);
export default App;
