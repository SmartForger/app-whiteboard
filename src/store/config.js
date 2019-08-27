import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import appReducer from './reducers';
import rootSaga from './sagas';

export default () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(appReducer, applyMiddleware(sagaMiddleware));

  sagaMiddleware.run(rootSaga);

  return store;
};
