import React, { Component } from 'react';

class ScoreCounter extends Component {
  render() {
    let backgroundColor = this.props.position === "left" ? "red" : "blue";

    const style = {
      background: backgroundColor
    }

    return (
      <div className="ScoreCounter" style={style}>
        <div>1</div>
      </div>
    )
  }
}

export default ScoreCounter;