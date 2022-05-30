import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store';

import { PersistGate } from 'redux-persist/integration/react';
import KeyCloakMiddleware from './KeyCloakMiddleware';
import './i18n';

import { ThemeProvider, theme } from './Themes/theme';

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <KeyCloakMiddleware />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </CookiesProvider>,
  document.getElementById('root'),
);
