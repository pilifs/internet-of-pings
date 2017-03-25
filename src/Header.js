/* global base */
import React, { Component } from 'react';
import EnterPassword from './EnterPassword';
import './Header.css';

class Header extends Component {

  render() {
    const style = {
      height: 50
    };

    var mainHeader;

    if (this.props.auth.inProgress || this.props.auth.enterCredentials) {
      style.height = 150;
      mainHeader = <EnterPassword
        inProgress={this.props.auth.inProgress}
        handleAuthenticate={this.props.handleAuthenticate}
      />;
    } else {
      mainHeader = <div>Title</div>;
    }

    return (
      <div className="Header" style={style}>
        {mainHeader}
      </div>
    );
  };
}

export default Header;