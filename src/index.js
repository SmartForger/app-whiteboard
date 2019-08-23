import React from 'react';
import App from './App';
import ReactWebComponent from "react-web-component";
import './styles/app.scss';

if (!customElements.get('white-board-widget')) {
  ReactWebComponent.create(<App />, 'white-board-widget');
}

