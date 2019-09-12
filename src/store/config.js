import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import appReducer from './reducers';
import rootSaga from './sagas';

export default () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    appReducer,
    applyMiddleware(sagaMiddleware, logger)
  );

  sagaMiddleware.run(rootSaga);

  return store;
};
