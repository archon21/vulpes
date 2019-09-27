import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Home, Player, Auth, Uploader } from './components';
import { NotFound, Loader } from './sub-components';
import Privacy from './components/Footer/Privacy';
import { connect } from 'react-redux';


class Routes extends Component {
  state = { mounted: false };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate(prevProps) {
    window.scrollTo(0, 0);
    if (this.props.user.uid !== prevProps.user.uid) {
      this.setState({});
    }
  }
  render() {
    const { mounted } = this.state;
    const { user } = this.props;
    return mounted ? (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={Auth} />
        <Route exact path="/signup" component={Auth} />
        <Route exact path="/player" component={Player} />
        <Route exact path="/uploader" component={Uploader} />
        <Route component={NotFound} />
      </Switch>
    ) : (
      <Loader />
    );
  }
}

const mapStateToProps = state => ({
  user: state.firebase.user
});

export default withRouter(connect(mapStateToProps)(Routes))
