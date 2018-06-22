import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import api from './middleware/api';
import rootReducer from './reducers/index';
import { config } from "../config";

export const configureStore = function configureStore() {
  const selectedCompose =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewares = [thunk, api];

  if (config.reduxLog) {
    middlewares.push(createLogger());
  }

  const store = createStore(
    rootReducer,
    /* preloadedState, */ selectedCompose(
      applyMiddleware(...middlewares)
    )
  );

  if (module.hot) {
    module.hot.accept('./reducers/index', () => {
      /* eslint-disable global-require */
      store.replaceReducer(require('./reducers/index').default);
    });
  }
  return store;
}
