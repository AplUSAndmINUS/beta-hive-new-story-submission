import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

// Ensure the app initializes only after the entire page has loaded
window.onload = () => {
  const rootElement = document.getElementById('root') as HTMLElement;

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error(
      'Root element not found. Ensure the div with id="root" exists in the WordPress page.'
    );
  }
};
