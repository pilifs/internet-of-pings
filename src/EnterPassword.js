import React, { Component } from 'react';

class EnterPassword extends Component {

  render() {
    const element = this.props.inProgress ?
        <div>TODO: spinner</div> :
        <div>
          <form onSubmit={this.props.handleAuthenticate}>
            <input type="password" placeholder="Enter Firebase PW" className="fb-auth-pw" />
            <input type="submit" value="Submit" />
          </form>
        </div>;

    return element;
  };
}

export default EnterPassword;