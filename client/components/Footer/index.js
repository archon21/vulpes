import React from 'react';
import { connect } from 'react-redux';
import {Link } from 'react-router-dom'
const Footer = props => {
  const { phone, company } = props;
  return (
    <footer className="flex column align-center background-primary" id="footer-container">

      <h1 className="headline-4 color-tirciary">Welcome</h1>
    </footer>
  );
};

const mapStateToProps = state => ({
  phone: state.init.phone,
  company: state.init.company
});

export default connect(mapStateToProps)(Footer);
