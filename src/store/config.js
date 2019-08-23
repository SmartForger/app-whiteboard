import { createStore } from 'redux';
import appReducer from './reducers';

export default () => {
  const store = createStore(appReducer);

  return store;
}
