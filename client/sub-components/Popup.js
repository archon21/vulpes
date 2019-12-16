import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appInteraction } from '../store';

class Popup extends Component {
  state = {
    open: this.props.open,
    screenX: 0,
    screenY: 0
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.open !== nextProps.open) {
      return {
        open: nextProps.open
      };
    } else {
      return {};
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState && prevState.open !== this.props.open) {
      const { screenX, screenY } = this.props.popupCoords;
      this.checkBounds(screenX, screenY);
    }
  }

  checkBounds = (screenX, screenY) => {
    const { innerWidth, innerHeight } = window;
    let newX, newY;
    if (screenX > innerWidth - 200) {
      newX = screenX - 200;
    } else if (screenX < 200) {
      newX = +200;
    } else {
      newX = screenX;
    }
    if (screenY > innerHeight - 200) {
      newY = screenY - 200;
    } else if (screenY < 200) {
      newY = +200;
    } else {
      newY = screenY;
    }
    this.setState({ screenX: newX, screenY: newY, open: true });
  };

  render() {
    const { open, screenX, screenY } = this.state;

    const { template } = this.props;
    return (
      <div
        className={`absolute popup-transform ${
          open ? 'popup-filled' : 'popup-empty'
        }`}
        style={{ zIndex: 100, left: screenX, top: screenY }}
      >
        <div
          onClick={this.props.appInteraction}
          className={`${open ? 'alert__catcher' : ''}`}
        />
        {open ? template : <div />}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  appInteraction: () => dispatch(appInteraction('popup', false))
});

export default connect(null, mapDispatchToProps)(Popup);
