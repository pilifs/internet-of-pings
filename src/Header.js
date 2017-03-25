/* global base */
import React, { Component } from 'react';
import EnterPassword from './EnterPassword';
import './Header.css';

class Header extends Component {

  render() {
    const mainHeader = (this.props.auth.inProgress || this.props.auth.enterCredentials) ?
        <EnterPassword
          inProgress={this.props.auth.inProgress}
          handleAuthenticate={this.props.handleAuthenticate}
        /> :
        <div>I'm a header</div>;

    return (
      <div className="Header">
        {mainHeader}
      </div>
    );
  };
}

export default Header;