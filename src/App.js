import React, { Component } from 'react';
import Scoreboard from './Scoreboard';
import Footer from './Footer';
import Header from './Header';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      settings: {},
      player1: {
        name: "Filip",
        score: 0
      },
      player2: {
        name: "Alda",
        score: 0
      }
    }

    // Has to be a better way to bind context of this
    this._decrementScore = this._decrementScore.bind(this);
    this._incrementScore = this._incrementScore.bind(this);
  };

  _handleButtons(event) {
    var player;
    var action;
    var key = event.key;

    switch (key) {
      case "q":
        action = this._incrementScore;
        player = "player1";
        break;
      case "w":
        action = this._decrementScore;
        player = "player1";
        break;
      case "o":
        action = this._incrementScore;
        player = "player2";
        break;
      case "p":
        action = this._decrementScore;
        player = "player2";
        break;
      default:
        return;
    }

    action(player);
  };

  _incrementScore(player) {
    this.setState((prevState, props) => {
      return prevState[player].score += 1;
    });
  };

  _decrementScore(player) {
    this.setState((prevState, props) => {
      if (prevState[player].score === 0) { return {score: prevState[player].score }; }
      return prevState[player].score -= 1;
    });
  };

  componentWillMount() {
    document.addEventListener("keydown", this._handleButtons.bind(this));
  };

  componentWillUnmount() {
    document.addEventListener("keydown", this._handleButtons.bind(this));
  };

  render() {
    return (
      <div className="App">
        <Header />
        <Scoreboard game={this.state}/>
        <Footer />
      </div>
    );
  };
}

export default App;
