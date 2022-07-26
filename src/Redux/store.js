/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { createStore} from "redux";
import rootReducer from "./Reducers";
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const setTransform = createTransform(null, (outboundState, key) => {
  return [...(outboundState.map(item => { if ((item.status === 'uploading') || (item.status === 'waiting')) { item['status'] = 'error'; } return item; }))]
}, { whitelist: ['uploadList',] })

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [], //['username','isLogin'],
  transforms: [setTransform]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


const configureStore = () => {
  //const store = createStore(persistedReducer,  composeEnhancers(applyMiddleware(...middlewares)));
  const store = createStore(persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  const persistor = persistStore(store)
  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./Reducers', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  return { store, persistor };
};

const { store, persistor } = configureStore()

export { store, persistor };