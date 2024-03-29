/* From @material-ui/core@4.2.1 */

import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { elementAcceptingRef } from '@material-ui/utils';
import ownerDocument from '@material-ui/core/utils/ownerDocument';
import Portal from '@material-ui/core/Portal';
import { createChainedFunction } from '@material-ui/core/utils/helpers';
import { useForkRef } from '@material-ui/core/utils/reactHelpers';
import useEventCallback from '@material-ui/core/utils/useEventCallback';
import zIndex from '@material-ui/core/styles/zIndex';
import ModalManager, { ariaHidden } from '@material-ui/core/Modal/ModalManager';
import TrapFocus from '@material-ui/core/Modal/TrapFocus';
import SimpleBackdrop from '@material-ui/core/Modal/SimpleBackdrop';
import { removeTransform, restoreTransform } from './transform-patch';
import { getTarget } from '../core/utils';

function getContainer(container) {
  container = typeof container === 'function' ? container() : container;
  return ReactDOM.findDOMNode(container);
}

function getHasTransition(props) {
  return props.children ? props.children.props.hasOwnProperty('in') : false;
}

// Modals don't open on the server so this won't conflict with concurrent requests.
const defaultManager = new ModalManager();

function getModal(modal, mountNodeRef, modalRef) {
  modal.current.modalRef = modalRef.current;
  modal.current.mountNode = mountNodeRef.current;
  return modal.current;
}

export const styles = theme => ({
  /* Styles applied to the root element. */
  root: {
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
  },
  /* Styles applied to the root element if the `Modal` has exited. */
  hidden: {
    visibility: 'hidden',
  },
});

/**
 * Modal is a lower-level construct that is leveraged by the following components:
 *
 * - [Dialog](/api/dialog/)
 * - [Drawer](/api/drawer/)
 * - [Menu](/api/menu/)
 * - [Popover](/api/popover/)
 *
 * If you are creating a modal dialog, you probably want to use the [Dialog](/api/dialog/) component
 * rather than directly using Modal.
 *
 * This component shares many concepts with [react-overlays](https://react-bootstrap.github.io/react-overlays/#modals).
 */
const Modal = React.forwardRef(function Modal(props, ref) {
  const {
    BackdropComponent = SimpleBackdrop,
    BackdropProps,
    children,
    closeAfterTransition = false,
    container,
    disableAutoFocus = false,
    disableBackdropClick = false,
    disableEnforceFocus = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    disableRestoreFocus = false,
    hideBackdrop = false,
    keepMounted = false,
    manager = defaultManager,
    onBackdropClick,
    onClose,
    onEscapeKeyDown,
    onRendered,
    open,
    webComponent,
    dispatch,
    ...other
  } = props;

  const theme = useTheme();
  const [exited, setExited] = React.useState(!open);
  const [transformRemoved, setTransformRemoved] = React.useState(false);
  const modal = React.useRef({});
  const mountNodeRef = React.useRef(null);
  const modalRef = React.useRef(null);
  const handleRef = useForkRef(modalRef, ref);
  const hasTransition = getHasTransition(props);

  const getDoc = () => ownerDocument(mountNodeRef.current);

  const handleMounted = () => {
    manager.mount(getModal(modal, mountNodeRef, modalRef));

    // Fix a bug on Chrome where the scroll isn't initially 0.
    modalRef.current.scrollTop = 0;
  };

  const handleOpen = useEventCallback(() => {
    const resolvedContainer = getContainer(container) || getDoc().body;

    manager.add(getModal(modal, mountNodeRef, modalRef), resolvedContainer);
    removeTransform(webComponent);
    setTransformRemoved(true);

    // The element was already mounted.
    if (modalRef.current) {
      handleMounted();
    }
  });

  const handlePortalRef = useEventCallback(node => {
    mountNodeRef.current = node;

    if (!node) {
      return;
    }

    if (onRendered) {
      onRendered();
    }

    if (open) {
      handleMounted();
    } else {
      ariaHidden(modalRef.current, true);
    }
  });

  const handleClose = React.useCallback(() => {
    manager.remove(getModal(modal, mountNodeRef, modalRef));
  }, [manager]);

  React.useEffect(() => {
    return () => {
      handleClose();
    };
  }, [handleClose]);

  React.useEffect(() => {
    if (open) {
      handleOpen();
    } else if (!hasTransition || !closeAfterTransition) {
      handleClose();
    }
  }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);

  const isTopModal = React.useCallback(
    () => manager.isTopModal(getModal(modal, mountNodeRef, modalRef)),
    [manager],
  );

  if (!keepMounted && !open && (!hasTransition || exited)) {
    return null;
  }

  const handleEnter = () => {
    setExited(false);
  };

  const handleExited = () => {
    setExited(true);
    if (closeAfterTransition) {
      handleClose();
    }

    if (transformRemoved) {
      restoreTransform(webComponent);
      setTransformRemoved(false);
    }
  };

  const handleBackdropClick = event => {
    const target =  getTarget(event);
    if (event.target !== target) {
      return;
    }

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (!disableBackdropClick && onClose) {
      onClose(event, 'backdropClick');
    }
  };

  const handleKeyDown = event => {
    // We don't take event.defaultPrevented into account:
    //
    // event.preventDefault() is meant to stop default behaviours like
    // clicking a checkbox to check it, hitting a button to submit a form,
    // and hitting left arrow to move the cursor in a text input etc.
    // Only special HTML elements have these default behaviors.
    if (event.key !== 'Escape' || !isTopModal()) {
      return;
    }

    // Swallow the event, in case someone is listening for the escape key on the body.
    event.stopPropagation();

    if (onEscapeKeyDown) {
      onEscapeKeyDown(event);
    }

    if (!disableEscapeKeyDown && onClose) {
      onClose(event, 'escapeKeyDown');
    }
  };

  const inlineStyle = styles(theme || { zIndex });
  const childProps = {};
  if (children.role === undefined) {
    childProps.role = children.role || 'document';
  }
  if (children.tabIndex === undefined) {
    childProps.tabIndex = children.tabIndex || '-1';
  }

  // It's a Transition like component
  if (hasTransition) {
    childProps.onEnter = createChainedFunction(handleEnter, children.props.onEnter);
    childProps.onExited = createChainedFunction(handleExited, children.props.onExited);
  }

  return (
    <Portal ref={handlePortalRef} container={container} disablePortal={disablePortal}>
      {/*
          Marking an element with the role presentation indicates to assistive technology
          that this element should be ignored; it exists to support the web application and
          is not meant for humans to interact with directly.
          https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
        */}
      <div
        data-mui-test="Modal"
        ref={handleRef}
        onKeyDown={handleKeyDown}
        role="presentation"
        {...other}
        style={{
          ...inlineStyle.root,
          ...(!open && exited ? inlineStyle.hidden : {}),
          ...other.style,
        }}
      >
        {hideBackdrop ? null : (
          <BackdropComponent open={open} onClick={handleBackdropClick} {...BackdropProps} />
        )}
        <TrapFocus
          disableEnforceFocus={disableEnforceFocus}
          disableAutoFocus={disableAutoFocus}
          disableRestoreFocus={disableRestoreFocus}
          getDoc={getDoc}
          isEnabled={isTopModal}
          open={open}
        >
          {React.cloneElement(children, childProps)}
        </TrapFocus>
      </div>
    </Portal>
  );
});

Modal.propTypes = {
  /**
   * A backdrop component. This prop enables custom backdrop rendering.
   */
  BackdropComponent: PropTypes.elementType,
  /**
   * Properties applied to the [`Backdrop`](/api/backdrop/) element.
   */
  BackdropProps: PropTypes.object,
  /**
   * A single child content element.
   */
  children: elementAcceptingRef.isRequired,
  /**
   * When set to true the Modal waits until a nested Transition is completed before closing.
   */
  closeAfterTransition: PropTypes.bool,
  /**
   * A node, component instance, or function that returns either.
   * The `container` will have the portal children appended to it.
   */
  container: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * If `true`, the modal will not automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes.
   * This also works correctly with any modal children that have the `disableAutoFocus` prop.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableAutoFocus: PropTypes.bool,
  /**
   * If `true`, clicking the backdrop will not fire any callback.
   */
  disableBackdropClick: PropTypes.bool,
  /**
   * If `true`, the modal will not prevent focus from leaving the modal while open.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableEnforceFocus: PropTypes.bool,
  /**
   * If `true`, hitting escape will not fire any callback.
   */
  disableEscapeKeyDown: PropTypes.bool,
  /**
   * Disable the portal behavior.
   * The children stay within it's parent DOM hierarchy.
   */
  disablePortal: PropTypes.bool,
  /**
   * If `true`, the modal will not restore focus to previously focused element once
   * modal is hidden.
   */
  disableRestoreFocus: PropTypes.bool,
  /**
   * If `true`, the backdrop is not rendered.
   */
  hideBackdrop: PropTypes.bool,
  /**
   * Always keep the children in the DOM.
   * This prop can be useful in SEO situation or
   * when you want to maximize the responsiveness of the Modal.
   */
  keepMounted: PropTypes.bool,
  /**
   * @ignore
   *
   * A modal manager used to track and manage the state of open Modals.
   */
  manager: PropTypes.object,
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick: PropTypes.func,
  /**
   * Callback fired when the component requests to be closed.
   * The `reason` parameter can optionally be used to control the response to `onClose`.
   *
   * @param {object} event The event source of the callback
   * @param {string} reason Can be:`"escapeKeyDown"`, `"backdropClick"`
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the escape key is pressed,
   * `disableEscapeKeyDown` is false and the modal is in focus.
   */
  onEscapeKeyDown: PropTypes.func,
  /**
   * Callback fired once the children has been mounted into the `container`.
   * It signals that the `open={true}` prop took effect.
   *
   * This prop will be deprecated and removed in v5, the ref can be used instead.
   */
  onRendered: PropTypes.func,
  /**
   * If `true`, the modal is open.
   */
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ component }) => ({
  webComponent: component.component
});

export default connect(mapStateToProps)(Modal);
