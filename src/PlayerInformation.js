import React, { Component } from 'react';

class PlayerInformation extends Component {

  render() {
    const backgroundColor = this.props.position === "left" ? "red" : "blue";

    const score = this.props.score;

    const style = {
      background: backgroundColor
    }

    return (
      <div className="PlayerInformation" style={style}>
        <div className="playerName">{this.props.name}{this.props.isWinner && " wins!!!"}</div>
        <div className="scoreCounter">{score}</div>
      </div>
    );
  };
}

export default PlayerInformation;