import { combineReducers } from 'redux';

import ui from './ui';
import component from './component';
import canvas from './canvas';

export default combineReducers({
  ui,
  component,
  canvas
});
