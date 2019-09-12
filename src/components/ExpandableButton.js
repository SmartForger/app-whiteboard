import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { IconButton } from '@material-ui/core';
import Popover from '../material-ui/Popover';

const ExpandableButton = ({
  classNames,
  anchorOrigin,
  transformOrigin,
  buttonIcon,
  expanded,
  onExpand,
  children
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const buttonRef = React.useRef();

  return (
    <>
      <IconButton
        ref={buttonRef}
        size="small"
        className={cls(classNames, {
          expanded: expanded === 0
        })}
        onClick={ev => {
          setAnchorEl(buttonRef.current);
          if (!anchorEl) {
            onExpand();
          }
        }}
      >
        {buttonIcon}
      </IconButton>
      <Popover
        classes={{
          paper: 'expandable-popover'
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        elevation={1}
      >
        {children}
      </Popover>
    </>
  );
};

ExpandableButton.propTypes = {
  buttonIcon: PropTypes.node.isRequired,
  classNames: PropTypes.string,
  expanded: PropTypes.bool,
  anchorOrigin: PropTypes.object,
  onExpand: PropTypes.func
};

ExpandableButton.defaultProps = {
  classNames: '',
  expanded: false,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  onExpand: () => {}
};

export default ExpandableButton;
