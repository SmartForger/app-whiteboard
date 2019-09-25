import { combineReducers } from 'redux';

import ui from './ui';
import component from './component';
import canvas from './canvas';
import session from './session';
import user from './user';
import panel from './panel';

export default combineReducers({
  ui,
  component,
  canvas,
  session,
  user,
  panel
});
