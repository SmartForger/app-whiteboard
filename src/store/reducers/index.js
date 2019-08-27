import { combineReducers } from 'redux';

import ui from './ui';
import component from './component';
import toolbar from './toolbar';

export default combineReducers({
  ui,
  component,
  toolbar
});
