import React, { Component } from 'react';

class PlayerInformation extends Component {

  constructor() {
    super();

    this.state = {
      score: 0
    }

    // Has to be a better way to bind context of this in all event handlers to component
    this._handleClick = this._handleClick.bind(this);
  };

  _handleClick(event) {
    let elemBoundaries = event.currentTarget.getBoundingClientRect();
    let clickedTopHalf = (event.clientY < elemBoundaries.top + (elemBoundaries.height / 2)) ? true : false;

    if (clickedTopHalf) {
      this._incrementScore();
    } else {
      this._decrementScore();
    }
  };

  _incrementScore() {
    this.setState((prevState, props) => {
      return {score: prevState.score + 1};
    });
  };

  _decrementScore() {
    this.setState((prevState, props) => {
      if (prevState.score === 0) { return {score: prevState.score }; }
      return {score: prevState.score - 1};
    });
  };

  render() {
    const backgroundColor = this.props.position === "left" ? "red" : "blue";
    const playerName = this.props.position === "left" ? "player1" : "player2";

    const score = this.state.score;

    const style = {
      background: backgroundColor
    }

    return (
      <div className="PlayerInformation" style={style} onClick={this._handleClick}>
        <div className="playerName">{playerName}</div>
        <div className="scoreCounter">{score}</div>
      </div>
    );
  };
}

export default PlayerInformation;