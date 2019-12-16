import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Home, Auth, Uploader, Library } from './components';
import { NotFound } from './sub-components';
import { Triangle } from './sub-components/Loaders';

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
    return (
      <div>
        <Switch>
          {user.uid ? (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/library" component={Library} />
              <Route exact path="/uploader" component={Uploader} />
              <Route component={NotFound} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/signup" component={Auth} />
              <Route exact path="/signin" component={Auth} />
              <Route component={Auth} />
            </Switch>
          )}
        </Switch>
        <Triangle transitioning={mounted} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.firebase.user
});

export default withRouter(connect(mapStateToProps)(Routes));
