import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { auth } from '../store';
import { connect } from 'react-redux';
class Auth extends Component {
  state = {
    page: 'signin',
    email: '',
    password: ''
  };

  componentDidMount = () => {
    const pathArr = this.props.location.pathname.split('/');
    pathArr[pathArr.length - 1] === 'signin'
      ? this.setState({ page: 'signin' })
      : this.setState({ page: 'signup' });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSignIn = async event => {
    event.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;
    await this.props.auth({ email, password });

    if (this.props.user.uid) {
      history.push('/player');
    }
  };

  handleSignUp = () => {};

  render() {
    const { page, email, password } = this.state;
    return page === 'signin' ? (
      <form
        key={this.props.location.pathname}
        onSubmit={this.handleSignIn}
        className="component flex column align-center w-100 "
      >
        <TextField
          placeholder="Email"
          name="email"
          required
          variant="outlined"
          onChange={this.handleChange}
          className="footer__contact__textfield"
          value={email}
        />
        <TextField
          placeholder="Password"
          name="password"
          required
          variant="outlined"
          onChange={this.handleChange}
          className="footer__contact__textfield"
          value={password}
        />
        <button type="submit" className="button">
          Sign In
        </button>
      </form>
    ) : (
      <div>
        <TextField
          placeholder="Password"
          name="password"
          required
          variant="outlined"
          onChange={this.handleChange}
          className="footer__contact__textfield"
          password
          value={password}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  auth: userData => dispatch(auth(userData))
});

const mapStateToProps = state => ({
  user: state.firebase.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
