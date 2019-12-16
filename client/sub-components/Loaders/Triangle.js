import React from 'react';

const Tirangle = props => {
  const { transitioning } = props;
  return (
    <div  className={`loader__triangle ${transitioning ? 'transitioning' : ''}`}>
      <div
        className={`loader__triangle-left ${transitioning ? 'transitioning' : ''}`}
      />
      <div
        className={`loader__triangle-right ${transitioning ? 'transitioning' : ''}`}
      />
    </div>
  );
};

export default Tirangle;
