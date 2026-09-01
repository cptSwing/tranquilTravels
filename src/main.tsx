import { StrictMode } from 'preact/compat';
import { render } from 'preact';
import './index.css';
import App from './App.tsx';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('preact-root')!,
);
