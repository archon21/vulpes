import React, { Component } from 'react';
import { auth } from '../store';
import { connect } from 'react-redux';
import { Textfield } from '../sub-components';
import { WindoW, Block } from '../sub-components/containers';

class Auth extends Component {
  state = {
    page: 'signin',
    email: '',
    password: '',
    transitioning: false
  };

  componentDidMount = () => {
    const pathArr = this.props.location.pathname.split('/');
    pathArr[pathArr.length - 1] === 'signup' &&
      this.setState({ page: 'signin' });
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
      this.setState({ transform: true });
      history.push('/player');
    }
  };

  handleSignUp = () => {};

  handleHover = () => {
    const { transitioning } = this.state;
    const newStatus = !transitioning;
    this.setState({ transitioning: newStatus });
  };

  render() {
    const { page, email, password, transitioning } = this.state;

    return (
      <WindoW background="#333">
        {page !== 'signup' ? (
          <Block>
            <form
              key={this.props.location.pathname}
              onSubmit={this.handleSignIn}
              className="component flex column align-center w-100 "
            >
              <Textfield
                placeholder="Email"
                name="email"
                required
                variant="outlined"
                handleChange={this.handleChange}
                className="footer__contact__textfield"
                value={email}
              />
              <Textfield
                placeholder="Password"
                name="password"
                required
                variant="outlined"
                handleChange={this.handleChange}
                className="footer__contact__textfield"
                value={password}
              />
              <button type="submit" className="button">
                Sign In
              </button>
            </form>
          </Block>
        ) : (
          <div>
            <Textfield
              placeholder="Password"
              name="password"
              required
              variant="outlined"
              handleChange={this.handleChange}
              className="footer__contact__textfield"
              password
              value={password}
            />
          </div>
        )}
      </WindoW>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  auth: userData => dispatch(auth(userData))
});

const mapStateToProps = state => ({
  user: state.firebase.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
