import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import NavHButton from './NavHButton';
import { alertInteraction } from '../../store';
import { connect } from 'react-redux';
import Contact from '../Contact';

class Navbar extends Component {
  state = {
    open: true,
    selectedLink: ''
  };

  componentDidMount() {
    const { pathname } = this.props.location;
    const arr = pathname.split('/');
    const selectedLink = arr[arr.length - 1];
    this.setState({ selectedLink });
  }

  toggleNavH = () => {
    const css = !this.state.open;
    this.setState({ open: css });
  };

  openContact = () => {
    this.props.alertInteraction(true, <Contact />);
  };

  selectLink = link => {
    this.setState({ selectedLink: link });
  };

  render() {
    const { open, selectedLink } = this.state;
    return (
      <nav
        id="nav-h"
        className={`${!open &&
          'open'} flex column black align-center justify-center w-100`}
      >
        <div className="nav-h__upper flex row align-center" />
        <NavHButton open={open} toggleNavH={this.toggleNavH} />

        <div
          className={` ${!open &&
            'open'} nav-h__lower flex  wrap align-center justify-center nav-h__links `}
        >
          <Link
            className={`headline-6 nav__link color-white p-5px ${selectedLink ===
              'downloader' && 'selected'}`}
            to={{ pathname: '/' }}
            onClick={() => this.selectLink('about')}
          >
            DOWNLOADER
          </Link>
          <Link
            className={`headline-6 nav__link color-white p-5px ${selectedLink ===
              'player' && 'selected'}`}
            to={{ pathname: '/player' }}
            onClick={() => this.selectLink('player')}
          >
            PLAYER
          </Link>
          <Link
            className={`headline-6 nav__link color-white p-5px ${selectedLink ===
              'uploader' && 'selected'}`}
            to={{ pathname: '/uploader' }}
            onClick={() => this.selectLink('uploader')}
          >
            UPLOADER
          </Link>
        </div>

      </nav>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  alertInteraction: (status, template) =>
    dispatch(alertInteraction(status, template))
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Navbar)
);
