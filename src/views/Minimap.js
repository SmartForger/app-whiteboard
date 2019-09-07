import React from 'react';
import cls from 'classnames';
import { connect } from 'react-redux';

const Minimap = ({ minimapVisible }) => (
  <div
    className={cls("minimap", {hidden: !minimapVisible})}
  >
    <div className="minimapBg" />
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        transform: 'translateY(-100%)'
      }}
    >
      <div className="minimapRect" />
    </div>
  </div>
);

const mapStateToProps = state => ({
  minimapVisible: state.ui.minimap
});

export default connect(mapStateToProps)(Minimap);
