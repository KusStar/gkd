import './main.css'

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('app');

const root = createRoot(rootElement as HTMLElement);

const mountNode = (
  <StrictMode>
    <App />
  </StrictMode>
);

root.render(mountNode);
