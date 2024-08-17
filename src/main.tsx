import React from 'react';
import { createRoot } from 'react-dom/client';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from './components/snackbar-provider'; // Adjust the path as necessary
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </LocalizationProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
