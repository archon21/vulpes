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
          'open'} flex row black align-center align-center justify-center w-100`}
      >
        <Link
          className={`headline-6 nav__link color-white p-5px ${selectedLink ===
            'downloader' && 'selected'}`}
          to={{ pathname: '/' }}
          onClick={() => this.selectLink('about')}
        >
          <i
            className={`material-icons color-white p-5px ${selectedLink ===
              'downloader' && 'selected'}`}
          >
            cloud_download
          </i>
        </Link>
        <Link
          className={`headline-6 nav__link color-white p-5px ${selectedLink ===
            'library' && 'selected'}`}
          to={{ pathname: '/library' }}
          onClick={() => this.selectLink('library')}
        >
          <i
            className={`material-icons color-white p-5px ${selectedLink ===
              'library' && 'selected'}`}
          >
            library_music
          </i>
        </Link>
        <Link
          className={`headline-6 nav__link color-white p-5px ${selectedLink ===
            'uploader' && 'selected'}`}
          to={{ pathname: '/uploader' }}
          onClick={() => this.selectLink('uploader')}
        >
          <i
            className={`material-icons color-white p-5px ${selectedLink ===
              'uploader' && 'selected'}`}
          >
            cloud_upload
          </i>
        </Link>
      </nav>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  alertInteraction: (status, template) =>
    dispatch(alertInteraction(status, template))
});

export default withRouter(connect(null, mapDispatchToProps)(Navbar));
