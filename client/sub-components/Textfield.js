import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class Textfield extends Component {
  state = {
    error: false
  };

  removeError = () => {
    this.setState({ error: false });
  };
  render() {
    const {
      value,
      name,
      required,
      placeholder,
      handleChange,
      variant,
      error
    } = this.props;
    console.log(required)
    return (
      <div>
        <input
          name={name}
          placeholder={placeholder ? placeholder : ''}
          value={value}
          required={!!required}
          onChange={handleChange}
          className={variant ? variant : 'textfield'}
          required={required ? true : false}
        ></input>
      </div>
    );
  }
}

export default Textfield;
