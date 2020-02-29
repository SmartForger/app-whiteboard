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
  initBoard,
  setEventId
} from './store/actions';
import initSocket from './core/socket';
import initCanvasHistory from './core/canvas-history';
import initGC from './core/gc';
import { setBaseURLs, getUsers } from './core/api';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jss: null,
      theme: null,
      shouldRender: true // For local development, 'true' in production
    };
    this.store = initStore();
  }

  render() {
    const { jss, theme, shouldRender } = this.state;

    return (
      jss &&
      shouldRender && (
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
            const { user } = this.store.getState();

            this.store.dispatch(
              setUser({
                userId: user.eventId
                  ? userState.userProfile.email
                  : userState.userId,
                userName:
                  userState.userProfile.firstName +
                  ' ' +
                  userState.userProfile.lastName,
                token: userState.bearerToken,
                realm: userState.realm,
                ssoId: userState.userId,
                email: userState.userProfile.email
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
            const serviceUrl = init.coreServices.appsServiceConnection.split(
              '/apps-service'
            )[0];
            const ssoUrl = init.coreServices.ssoConnection;
            initSocket(serviceUrl);
            setBaseURLs(serviceUrl, ssoUrl);
            initCanvasHistory();
            initGC();
            this.store.dispatch(initBoard());
            window.__whiteboardSocket.addStore(this.store);
          }
        }
      })
    );
    component.dispatchEvent(
      new CustomEvent('onSharedRequestsCallback', {
        detail: {
          callback: event => {
            this.setEvent(event);
          }
        }
      })
    );

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

    // For local development, disable on production
    // document.addEventListener('od360_token_updated', ev => {
    //   if (!this.state.shouldRender) {
    //     this.localInit(ev.detail.token);
    //   } else {
    //     this.localSetToken(ev.detail.token);
    //   }
    // });
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

  setEvent(event) {
    if (event && event.Warden) {
      const {
        user: { realm, token, email }
      } = this.store.getState();
      getUsers({ token, realm, eventId: event.Warden }).then(users => {
        const user = users.find(u => u.userId === email);
        if (user) {
          this.store.dispatch(setUser({ team: user.team }));
        }
        this.store.dispatch(setEventId(event.Warden));
        window.__whiteboardSocket.initSession();
      });
    } else {
      this.store.dispatch(setEventId(''));
    }
  }

  localInit(token) {
    this.store.dispatch(
      setUser({
        userId: '895ccd4e-d705-4e2d-81ea-b2e17f30c63b',
        userName: 'Andrew Fagin',
        token,
        realm: 'my-realm',
        ssoId: '895ccd4e-d705-4e2d-81ea-b2e17f30c63b',
        email: 'andrewfagin912@gmail.com'
      })
    );

    // this.store.dispatch(
    //   setUser({
    //     userId: '1a7ed696-2f8e-4d35-a7d0-61f13afd678a',
    //     userName: 'Carrington Morehouse',
    //     token,
    //     realm: 'my-realm',
    //     ssoId: '1a7ed696-2f8e-4d35-a7d0-61f13afd678a',
    //     email: 'cmorehouse@ultimateknowledge.com'
    //   })
    // );

    const serviceUrl = 'https://pcte.opendash360.com';
    const ssoUrl = 'https://sso.opendash360.com/';
    initSocket(serviceUrl);
    setBaseURLs(serviceUrl, ssoUrl);
    initCanvasHistory();
    initGC();
    this.store.dispatch(initBoard());
    window.__whiteboardSocket.addStore(this.store);

    this.setState({ shouldRender: true });

    // event id simulation
    // this.store.dispatch(setEventId(''));
    this.setEvent({
      Warden: 'some-event-id'
    });
  }

  localSetToken(token) {
    this.store.dispatch(setUser({ token }));
  }
}

export default App;
