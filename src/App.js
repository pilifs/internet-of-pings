import React, { Component } from 'react';
import Scoreboard from './Scoreboard';
import Footer from './Footer';
import Header from './Header';
import LoadingFullScreen from './LoadingFullScreen';
import Rebase from 're-base';
import './App.css';

// Not secret, always visible in browser
var firebaseConfig = {
  apiKey: "AIzaSyD7ggRzuXZw0dM5Quu-n-R2UgreylPdbiE",
  databaseURL: "https://internet-of-pings-f053e.firebaseio.com",
  authDomain: "internet-of-pings-f053e.firebaseapp.com",
  storageBucket: "internet-of-pings-f053e.appspot.com"
};

var base = Rebase.createClass(firebaseConfig, 'Internet of Pings');
base.database.enableLogging(true)

class App extends Component {

  constructor() {
    super();

    // Used to keep track of loading state
    // On Firebase sync this is overwritten by game object
    this.state = {
      game: false,
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
      return prevState.game[player].score += 1;
    });
  };

  _decrementScore(player) {
    this.setState((prevState, props) => {
      if (prevState.game[player].score === 0) { return {score: prevState[player].score }; }
      return prevState.game[player].score -= 1;
    });
  };

  componentWillMount() {
    document.addEventListener("keydown", this._handleButtons.bind(this));
  };

  componentDidMount() {
    this.ref = base.syncState('game', {
      context: this,
      state: 'game',
      // then: that._loadApp() This callback is called on initial handshake but before any data actually comes back from Firebase
      // --> cannot use it to toggle loading as suggested in the re-base docs
    });
  };

  componentWillUnmount() {
    base.removeBinding(this.ref);
    document.removeEventListener("keydown", this._handleButtons.bind(this));
  };

  render() {
    var that = this;

    const app = (isLoading) => {
      return (isLoading) ?
          (
            <div className="AppLoading">
              <LoadingFullScreen />
            </div>
          ) :
          (
            <div className="App">
              <Header />
              <Scoreboard game={that.state.game}/>
              <Footer />;
            </div>
          );
    };

    return app(!this.state.game);
  };
}

export default App;
