import { combineReducers } from 'redux';

import ui from './ui';
import component from './component';

export default combineReducers({
  ui,
  component
});
