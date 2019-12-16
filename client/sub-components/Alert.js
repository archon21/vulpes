import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appInteraction } from '../store';

class Alert extends Component {
  state = {
    open: this.props.open
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.open !== nextProps.open) return { open: nextProps.open };
    else return {};
  }

  handleClose = () => {
    this.props.appInteraction()
    this.setState({open: false})
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.open !== this.props.open) this.handleOpen();
  // }

  // handleOpen = inAlert => {
  //   const { open } = this.state;
  //   const { onClickCatcher } = this.props;
  //   const newOpen = !open;
  //   // inAlert
  //   //  onClickCatcher && onClickCatcher()
  //    this.setState({ open: newOpen })
  // };

  render() {
    const { open } = this.state;
    const { template, customStyle } = this.props;
    return open ? (
      <div className="alert flex align-center justify-center">
        <div className="alert__catcher" onClick={this.handleClose}  />
        <div style={customStyle && customStyle} onClick={this.handleClose} className="alert__container">
          {template && template}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  appInteraction: () => dispatch(appInteraction('alert', false))
});

export default connect(null, mapDispatchToProps)(Alert);
