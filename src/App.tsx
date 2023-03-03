import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { ToastProvider } from 'react-native-toast-notifications';
import { store, persistor } from './store';
import ApplicationNavigator from './navigators';
import { SheetProvider } from 'react-native-actions-sheet';
import './components/sheets';
import './translations';

const App = () => (
  <Provider store={store}>
    {/**
     * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
     * and saved to redux.
     * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
     * for example `loading={<SplashScreen />}`.
     * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
     */}
    <PersistGate loading={null} persistor={persistor}>
      <ToastProvider>
        <SheetProvider>
          <ApplicationNavigator />
        </SheetProvider>
      </ToastProvider>
    </PersistGate>
  </Provider>
);

export default App;
