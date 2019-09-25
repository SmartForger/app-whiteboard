import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';

class ChipInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputVal: ''
    };
    this.inputRef = React.createRef();
  }

  handleDelete = chip => () => {
    const { onChange, value } = this.props;
    onChange(value.filter(v => v !== chip));
  };

  addItem = () => {
    const { onChange, value } = this.props;
    const { inputVal } = this.state;
    if (value && value.indexOf(inputVal) < 0) {
      onChange([...value, inputVal.replace(',', '')]);
    }

    this.setState({
      inputVal: ''
    });
  };

  render() {
    const { value, label } = this.props;
    const { inputVal } = this.state;

    return (
      <div className="chip-input form-input-field">
        <div className="label">{label}</div>
        <div
          className="chip-container"
          onClick={() => {
            this.inputRef.current.focus();
          }}
        >
          {value.map(v => (
            <Chip key={v} label={v} onDelete={this.handleDelete(v)} />
          ))}
        </div>
        <input
          ref={this.inputRef}
          value={inputVal}
          onKeyUp={ev => {
            if (ev.code === 'Comma' || ev.code === 'Enter') {
              this.addItem();
            }
          }}
          onChange={ev => {
            this.setState({
              inputVal: ev.path[0].value
            });
          }}
        />
        <div className="border-bottom" />
      </div>
    );
  }
}

ChipInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
};

export default ChipInput;
