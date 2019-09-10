import React from 'react';
import App from './App';
import createWebComponent from './react-web-component';
import './styles/app.scss';

if (!customElements.get('white-board-widget5')) {
  createWebComponent(<App />, 'white-board-widget5');
}
