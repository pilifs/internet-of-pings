import React, { Component } from 'react';
import PlayerInformation from './PlayerInformation';
import './Scoreboard.css';

class Scoreboard extends Component {

  constructor() {
    super();
    this._isWinner = this._isWinner.bind(this);
  }

  _isWinner(playerName) {
    return playerName === this.props.game.winner;
  }

  render() {
    const dividerStyle = {
      width: '10px',
    };

    return (
      <div className="Scoreboard">
        <PlayerInformation
          isWinner={this._isWinner(this.props.game.player1.name) && true}
          name={this.props.game.player1.name}
          position="left"
          score={this.props.game.player1.score} />
        <div style={dividerStyle}></div>
        <PlayerInformation
          isWinner={this._isWinner(this.props.game.player2.name) && true}
          name={this.props.game.player2.name}
          position="right"
          score={this.props.game.player2.score} />
      </div>
    );
  };
}

export default Scoreboard;