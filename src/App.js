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

    this.state = {
      // game is explicitly defined to keep track of loading state
      // on Firebase sync this is overwritten by game object
      game: false,
      auth: {
        inProgress: false,
        enterCredentials: false
      },
      isAuthenticated: false
    }

    // TODO hardcoded
    this._scoreboardEmail = 'mainscoreboard@internetofpings.fake';

    // Has to be a better way to bind context of this
    this._updateScore = this._updateScore.bind(this);
    this._enterCredentials = this._enterCredentials.bind(this);
    this._handleAuthenticate = this._handleAuthenticate.bind(this);
    this._clearInputs = this._clearInputs.bind(this);
  };

  _handleButtons(event) {
    var action;
    var args = [];
    var key = event.key;

    switch (key) {
      case "q":
        action = this._updateScore;
        args.push("player1", "increment");
        break;
      case "w":
        action = this._updateScore;
        args.push("player1", "decrement");
        break;
      case "o":
        action = this._updateScore;
        args.push("player2", "increment");
        break;
      case "p":
        action = this._updateScore;
        args.push("player2", "decrement");
        break;
      case "l":
        action = this._enterCredentials;
        break;
      case "Escape":
        action = this._clearInputs;
        break;
      default:
        return;
    }

    action.apply(this, args);
  };

  _handleAuthenticate(event) {
    event.preventDefault();

    var that = this;
    var password = event.currentTarget.querySelector(".fb-auth-pw").value;

    this.setState({
      auth: {
        inProgress: true,
        enterCredentials: false
      }
    })

    base.authWithPassword({
      email    : that._scoreboardEmail,
      password : password
    }, function(error, user) {
      var msg = (error) ? "Error auth" : "Success auth";
      that._clearInputs();
      console.log(msg);
    });
  };

  _enterCredentials() {
    this.setState({
      auth: {
        inProgress: false,
        enterCredentials: true
      }
    });
  };

  _clearInputs() {
    this.setState({
      auth: {
        inProgress: false,
        enterCredentials: false
      }
    });
  };

  _updateScore(player, operator) {
    if (!this.state.isAuthenticated) { return; }

    var game = this.state.game;

    if (operator === "decrement" && game[player].score === 0) { return; }

    game[player].score = (operator === "increment") ? ++game[player].score : --game[player].score;
    this.setState({game: game});

    // re-base wraps setState and does not support below syntax
    // arguments must be: [newStateData, callback]
    // TODO will probably remove rebase later / fix this
    // this.setState((prevState, props) => {
    //   return prevState.game[player].score += 1;
    // });
  };

  componentWillMount() {
    document.addEventListener("keydown", this._handleButtons.bind(this));
  };

  componentDidMount() {
    var that = this;

    this.ref = base.syncState('game', {
      context: this,
      state: 'game',
      // then: that._loadApp() This callback is called on initial handshake but before any data actually comes back from Firebase
      // --> cannot use it to toggle loading as suggested in the re-base docs
    });

    base.onAuth(function (user) {
      var canUpdateScore = !!(user && user.email === that._scoreboardEmail);
      that.setState({isAuthenticated: canUpdateScore});
    });
  };

  componentWillUnmount() {
    base.removeBinding(this.ref);
    document.removeEventListener("keydown", this._handleButtons.bind(this));
  };

  render() {
    return !this.state.game ?
            <div className="AppLoading">
              <LoadingFullScreen />
            </div> :
            <div className="App">
              <Header
                auth={this.state.auth}
                handleAuthenticate={this._handleAuthenticate}
              />
              <Scoreboard game={this.state.game} />
              <Footer />;
            </div>;
  };
}

export default App;
