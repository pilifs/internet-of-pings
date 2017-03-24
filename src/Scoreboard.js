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
        <PlayerInformation name={this.props.game.player1.name} position="left" score={this.props.game.player1.score} />
        <div style={dividerStyle}></div>
        <PlayerInformation name={this.props.game.player2.name} position="right" score={this.props.game.player2.score} />
      </div>
    );
  };
}

export default Scoreboard;