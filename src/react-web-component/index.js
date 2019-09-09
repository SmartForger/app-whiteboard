import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import getStyleElementsFromReactWebComponentStyleLoader from './getStyleElementsFromReactWebComponentStyleLoader';
import extractAttributes from './extractAttributes';

import '@webcomponents/shadydom';
import '@webcomponents/custom-elements';

export default function create(app, tagName, useShadowDom = true) {
    let appInstance;

    const lifeCycleHooks = {
      attachedCallback: 'webComponentAttached',
      connectedCallback: 'webComponentConnected',
      disconnectedCallback: 'webComponentDisconnected',
      attributeChangedCallback: 'webComponentAttributeChanged',
      adoptedCallback: 'webComponentAdopted'
    };

    function callConstructorHook(webComponentInstance) {
      if (appInstance['webComponentConstructed']) {
        appInstance['webComponentConstructed'].apply(appInstance, [webComponentInstance])
      }
    }

    function callLifeCycleHook(hook, params) {
      const instanceParams = params || [];
      const instanceMethod = lifeCycleHooks[hook];

      if (instanceMethod && appInstance && appInstance[instanceMethod]) {
        appInstance[instanceMethod].apply(appInstance, instanceParams);
      }
    }

    const proto = class extends HTMLElement {
      static get observedAttributes() {
        return ['background'];
      }

      connectedCallback() {
        const webComponentInstance = this;
        let mountPoint = webComponentInstance;

        if (useShadowDom) {
          // Re-assign the webComponentInstance (this) to the newly created shadowRoot
          const shadowRoot = webComponentInstance.attachShadow({ mode: 'open' });
          // Re-assign the mountPoint to the newly created "div" element
          mountPoint = document.createElement('div');

          // Move all of the styles assigned to the react component inside of the shadowRoot.
          // By default this is not used, only if the library is explicitly installed
          const styles = getStyleElementsFromReactWebComponentStyleLoader();
          styles.forEach((style) => {
            shadowRoot.appendChild(style.cloneNode(shadowRoot));
          });

          shadowRoot.appendChild(mountPoint);

          retargetEvents(shadowRoot);
        }

        ReactDOM.render(React.cloneElement(app, extractAttributes(webComponentInstance)) , mountPoint, function () {
          appInstance = this;

          callConstructorHook(webComponentInstance);
          callLifeCycleHook('connectedCallback');
        });
      }
      disconnectedCallback () {
          callLifeCycleHook('disconnectedCallback');
      }
      attributeChangedCallback (attributeName, oldValue, newValue, namespace) {
        callLifeCycleHook('attributeChangedCallback', [attributeName, oldValue, newValue, namespace]);
      }
      adoptedCallback (oldDocument, newDocument) {
        callLifeCycleHook('adoptedCallback', [oldDocument, newDocument]);
      }
    }

    customElements.define(tagName, proto);
};
