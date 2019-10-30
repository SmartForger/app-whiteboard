import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { create } from 'jss';
import { StylesProvider, jssPreset, ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import customTheme from './theme';
import MainView from './views/Main';
import initStore from './store/config';
import {
  setComponent,
  setEraserBackground,
  setUser,
  initBoard
} from './store/actions';
import initSocket from './core/socket';
import initCanvasHistory from './core/canvas-history';
import initGC from './core/gc';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jss: null,
      theme: null
    };
    this.store = initStore();
    initSocket();
    initCanvasHistory();
    initGC();
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
    const root = component.shadowRoot.querySelector('div');
    root.style = 'height: 100%; position: relative;';

    this.webComponent = component.shadowRoot;
    this.store.dispatch(setComponent(component));
    this.store.dispatch(
      setEraserBackground(this.getBgObj(component.getAttribute('background')))
    );
    component.dispatchEvent(
      new CustomEvent('onUserStateCallback', {
        detail: {
          callback: userState => {
            this.store.dispatch(
              setUser({
                userId: userState.userId,
                userName:
                  userState.userProfile.firstName +
                  ' ' +
                  userState.userProfile.lastName,
                token: userState.bearerToken,
                realm: userState.realm
              })
            );
          }
        }
      })
    );
    component.dispatchEvent(
      new CustomEvent('onInitCallback', {
        detail: {
          callback: init => {
            window.__whiteboardBaseUrl = init.coreServices.appsServiceConnection.split('/apps-service')[0];
            window.__whiteboardSSOUrl = init.coreServices.ssoConnection;
            this.store.dispatch(initBoard());
            window.__whiteboardSocket.addStore(this.store);
          }
        }
      })
    );

    // const user = window.location.search.substr(6).split(',');
    // this.store.dispatch(
    //   setUser({
    //     userId: user[0],
    //     userName: user[1],
    //     realm: 'my-realm'
    //   })
    // );
    // this.store.dispatch(initBoard());
    // window.__whiteboardSocket.addStore(this.store);

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

  webComponentAttributeChanged(attributeName, oldValue, newValue) {
    if (attributeName === 'background') {
      this.store.dispatch(setEraserBackground(this.getBgObj(newValue)));
    }
  }

  getBgObj(v) {
    if (!v) {
      return {
        type: 'color',
        value: '#fff'
      };
    }

    if (v.match(/^#\w{3,8}$/)) {
      return {
        type: 'color',
        value: v
      };
    }

    return {
      type: 'base64',
      value: v
    };
  }
}

export default App;
