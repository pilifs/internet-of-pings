import React, { Component } from 'react';
import PlayerInformation from './PlayerInformation';
import './Scoreboard.css';

class Scoreboard extends Component {
  render() {
    const dividerStyle = {
      width: '10px',
    };

    return (
      <div className="Scoreboard">
        <PlayerInformation name="player1.name" position="left" />
        <div style={dividerStyle}></div>
        <PlayerInformation name="player2.name" position="right" />
      </div>
    );
  };
}

export default Scoreboard;