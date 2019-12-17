import React from 'react';

const Button = props => {
  const { variant, text, type } = props;
  const { onClick } = props;
  return (
    <button
      type={type ? type : 'button'}
      onClick={type === 'button' ? onClick : null}
      className={variant ? variant : 'button'}
    >
      {text}
    </button>
  );
};

export default Button;
