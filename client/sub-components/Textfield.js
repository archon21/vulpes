import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class Textfield extends Component {
  state = {
    value: '',
    error: false
  };

  handleChange = event => {
    const { value, name } = event.target;
    this.setState({ value: value });
    this.props.dataHook({ name, value });
  };

  removeError = () => {
    this.setState({ error: false });
  };
  render() {
    const {
      value,
      name,
      required,
      type,
      placeholder,
      handleChange,
      variant,
      className,
      error
    } = this.props;
    return (
      <TextField
        name={name}
        placeholder={placeholder ? placeholder : ''}
        value={value}
        required={!!required}
        onChange={handleChange}
        variant={variant ? variant : 'outlined'}
        className={className ? className : ''}
      />
    );
  }
}

export default Textfield;
