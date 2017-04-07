import React, { Component } from 'react';

class TenX extends Component {

  render() {
    const style = {
      zIndex: 1
    }

    // TODO: Canvas with bouncing 10x image
    return (
      <div style={style}>
        <img src={process.env.PUBLIC_URL + '/10x.png'} alt="10X" />
      </div>
    );
  };
}

export default TenX;