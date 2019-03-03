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
    console.log(link);
    this.setState({ selectedLink: link });
  };

  render() {
    const { open, selectedLink } = this.state;
    return (
      <nav id="nav-h" className="flex column black align-center">
        <div className="nav-h__upper flex row align-center">
          <NavHButton open={open} toggleNavH={this.toggleNavH} />
          <Link to={{pathname: '/'}}>
            <h1 className="headline-3 color-tirciary">Vulpes</h1>
          </Link>
        </div>

        <div className={` ${!open && 'open'} nav-h__lower flex row wrap align-center justify-center nav-h__links `}>
          <Link
            className={`headline-6 color-white p-5px ${selectedLink ===
              'about' && 'selected'}`}
            to={{ pathname: '/' }}
            onClick={() => this.selectLink('about')}
          >
            DOWNLOADER
          </Link>

          <h1
            className="headline-6 color-white"
            onClick={this.openContact}
          >
            CONTACT
          </h1>
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
