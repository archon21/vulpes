import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Navbar, Footer } from './components';
import Routes from './routes';
import { alertInteraction, auth } from './store';
import { Alert, Popup } from './sub-components';
import { Loader, Triangle } from './sub-components/Loaders';
import { Auth } from './utilities/firebase';

// const firestore = firebase.firestore();

class App extends Component {
  state = {
    mounted: false
  };
  async componentDidMount() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported.');
    }
    const url = window.location.origin+'/serviceworker/register-sw.js'
    console.log(url)
    const registration = await navigator.serviceWorker.register(url);
    console.log('SW registered.' + registration.scope);
    this.unsubscribe = await Auth.onAuthStateChanged(async user => {
      if (user) {
        await this.props.auth(user, true);
        this.setState({ mounted: true });
      } else {
        this.setState({ mounted: true });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { mounted } = this.state;
    const {
      alertStatus,
      alertTemplate,
      popupCoords,
      popupStatus,
      popupTemplate
    } = this.props;
    return (
      <div>
        <Alert
          open={alertStatus}
          template={alertTemplate}
          onClickCatcher={() => this.props.appInteraction('alert', false)}
        />
        <Popup
          open={popupStatus}
          template={popupTemplate}
          popupCoords={popupCoords}
          onClickCatcher={() => this.props.appInteraction('popup', false)}
        />
        <Navbar />
        <Routes />
        <Triangle transitioning={mounted} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menu: state,
  alertTemplate: state.util.alertTemplate,
  alertStatus: state.util.alertStatus,
  popupTemplate: state.util.popupTemplate,
  popupStatus: state.util.popupStatus,
  popupCoords: state.util.popupCoords
});

const mapDispatchToProps = dispatch => ({
  alertInteraction: (status, template) =>
    dispatch(alertInteraction(status, template)),
  auth: (user, inSession) => dispatch(auth(user, inSession))
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
