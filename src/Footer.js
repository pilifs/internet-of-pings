import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {


  render() {
    let footerContents;

    if (this.props.games === "loading") {
      footerContents = "Loading";
    } else {
      footerContents = this.props.games.length + " total game(s) played";
    }


    return (
      <div className="Footer">
        <div>{footerContents}</div>
      </div>
    );
  };
}

export default Footer;