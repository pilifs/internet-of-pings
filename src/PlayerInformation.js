import React, { Component } from 'react';

class PlayerInformation extends Component {

  constructor() {
    super();

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

    const score = this.props.score;

    const style = {
      background: backgroundColor
    }

    return (
      <div className="PlayerInformation" style={style} onClick={this._handleClick}>
        <div className="playerName">{this.props.name}</div>
        <div className="scoreCounter">{score}</div>
      </div>
    );
  };
}

export default PlayerInformation;