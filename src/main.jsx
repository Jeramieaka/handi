import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/error-boundary';
import '../styles/tokens.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<pre style="padding:24px;font-family:monospace">handi: missing #root element in index.html</pre>';
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
