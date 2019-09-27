import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Navbar, Footer } from './components';
import Routes from './routes';
import { alertInteraction, auth } from './store';
import { Alert, Loader } from './sub-components';
import { Auth } from './utilities/firebase';

// const firestore = firebase.firestore();

class App extends Component {
  state = {
    mounted: false
  };
  async componentDidMount() {
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
    const { alertStatus, alertTemplate } = this.props;
    return mounted ? (
      <div>
        <Alert
          open={alertStatus}
          template={alertTemplate}
          onClickCatcher={() => this.props.alertInteraction(false)}
        />
        <Navbar />
        <Routes />
      </div>
    ) : (
      <Loader />
    );
  }
}

const mapStateToProps = state => ({
  menu: state,
  alertTemplate: state.util.alertTemplate,
  alertStatus: state.util.alertStatus
});

const mapDispatchToProps = dispatch => ({
  alertInteraction: (status, template) =>
    dispatch(alertInteraction(status, template)),
  auth: (user, inSession) => dispatch(auth(user, inSession))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
