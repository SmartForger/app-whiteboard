import React from 'react';
import cls from 'classnames';

const InputField = ({ label, className, icon, ...props }) => (
  <div className={cls('form-input-field', className, { 'has-icon': icon })}>
    <div className="label">{label}</div>
    <input {...props} />
    <div className="border-bottom" />
    <div className="input-icon">{icon}</div>
  </div>
);

export default InputField;
