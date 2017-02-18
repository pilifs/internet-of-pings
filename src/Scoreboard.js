import React, { Component } from 'react';
import ScoreCounter from './ScoreCounter';
import './Scoreboard.css';

class Scoreboard extends Component {

  render() {
    const dividerStyle = {
      width: '10px',
    };

    return (
      <div className="Scoreboard">
        <ScoreCounter position="left" />
        <div style={dividerStyle}></div>
        <ScoreCounter position="right" />
      </div>
    )
  }
}

export default Scoreboard;