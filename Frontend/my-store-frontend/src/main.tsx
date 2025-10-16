// src/index.tsx (or src/main.tsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { BrowserRouter } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { Provider } from 'react-redux';
import { store } from './app/store';


Amplify.configure(awsExports);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>


        <App />

      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);