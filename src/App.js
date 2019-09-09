import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { create } from 'jss';
import { StylesProvider, jssPreset, ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import customTheme from './theme';
import MainView from './views/Main';
import initStore from './store/config';
import { setComponent } from './store/actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jss: null,
      theme: null
    };
    this.store = initStore();
  }

  render() {
    const { jss, theme } = this.state;

    return (
      jss && (
        <StylesProvider jss={jss}>
          <ThemeProvider theme={theme}>
            <Provider store={this.store}>
              <div className="app">
                <MainView />
              </div>
            </Provider>
          </ThemeProvider>
        </StylesProvider>
      )
    );
  }

  webComponentConstructed(component) {
    console.log(component.getAttribute('background'));
    const root = component.shadowRoot.querySelector('div');
    root.style = 'height: 100%; position: relative;';

    this.webComponent = component.shadowRoot;
    this.store.dispatch(setComponent(component));

    this.setState({
      jss: create({
        ...jssPreset(),
        insertionPoint: root
      }),
      theme: createMuiTheme({
        ...customTheme,
        props: {
          MuiPopover: {
            container: () => root
          },
          MuiPortal: {
            container: () => root
          },
          MuiDialog: {
            container: () => root
          },
          MuiModal: {
            container: () => root
          }
        }
      })
    });
  }

  webComponentAttributeChanged(...params) {
    console.log(params);
  }
}

export default App;
