import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

console.log('Hello from index.js!');

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);