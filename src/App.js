import React, { Component } from 'react';
import Scoreboard from './Scoreboard';
import Footer from './Footer';
import Header from './Header';
import LoadingFullScreen from './LoadingFullScreen';
import TenX from './TenX';
import Rebase from 're-base';
import _ from 'lodash';
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
      isAuthenticated: false,
      tenx: false
    }

    // TODO hardcoded
    this._scoreboardEmail = 'mainscoreboard@internetofpings.fake';

    // Has to be a better way to bind context of this
    this._updateScore = this._updateScore.bind(this);
    this._enterCredentials = this._enterCredentials.bind(this);
    this._handleAuthenticate = this._handleAuthenticate.bind(this);
    this._clearInputs = this._clearInputs.bind(this);
    this._submitGame = this._submitGame.bind(this);
    this._resetScores = this._resetScores.bind(this);
    this._trigger10x = this._trigger10x.bind(this);
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
      case "g":
        action = this._submitGame;
        break;
      case "Escape":
        action = this._clearInputs;
        break;
      case "n": // this is the action for swiping rfid when not enough players exist
        args = [this._generateRFID()];
        action = this._addPlayer;
        break;
      case "t":
        action = this._trigger10x;
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
  }

  _shittyUserReset() {
    console.log("Resetting Users");
    this.setState({game: {streak: this.state.game.streak}});
  }

  _generateRFID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  _addPlayer(rfid) {
    if (Object.keys(this.state.game).length < 2) {
      // implement logic to exchange rfid for player data
      var newGame = this.state.game;
      var playerName = "player" + (Object.keys(this.state.game).length + 1);
      newGame[playerName] = { "name":playerName, "rfid":rfid, "score":0 }; // don't store rfid here in the future
      this.setState({game: newGame});
    }
  }

  _updateScore(player, operator) {
    if (!this.state.isAuthenticated || !(this.state.game.player1 && this.state.game.player2)) {
      console.log("there must be at least two players to play");
      return;
    }
    var that = this;
    var is10x = false
    var game = _.clone(this.state.game);

    if (operator === "decrement" && game[player].score === 0) { return; }
    if (operator === "increment" && game.winner) { return; }
    if (game.winner && game.winner !== player) { return; }

    if (operator === "increment"){
      game[player].score = ++game[player].score;
      if (game["streak"].player !== game[player].name) {
        game["streak"].player = game[player].name;
        game["streak"].points = 1;
      } else {
        ++game["streak"].points;
        if (game["streak"].points === 10) {
          is10x = true;
          setTimeout(function () {
            that.setState({tenx: false});
          }, 3000);
        }
      }
    } else {
      game[player].score = --game[player].score;
      if (game["streak"].player === game[player].name) { --game["streak"].points; }
    }

    // game[player].score = (operator === "increment") ? ++game[player].score  : --game[player].score;

    let players = Object.keys(game);
    let opposingPlayer = _.find(players, function (p) {
      return p !== player;
    });

    if ((game[player].score >= 21 && (game[player].score - game[opposingPlayer].score) > 1) || game[player].score === 30) {
      game.winner = game[player].name;
    } else {
      game.winner = null;
    }

    this.setState({game: game, tenx: is10x});

    // re-base wraps setState and does not support below syntax
    // arguments must be: [newStateData, callback]
    // TODO will probably remove rebase later / fix this
    // this.setState((prevState, props) => {
    //   return prevState.game[player].score += 1;
    // });
  };

  _submitGame() {
    var that = this;

    base.push(
      "games",
      {
        data: {winner: {score: 0}, loser: {score: 0}},
        then(err) {
          if (!err) {
            that._resetScores();
          } else {
            console.log(err);
          }
        }
      }
    )
    this._shittyUserReset();
  };

  _resetScores() {
    var game = this.state.game;
    game.player1.score = 0;
    game.player2.score = 0;
    game.winner = null;

    this.setState({game: game});
  };

  _trigger10x() {
    var that = this;
    setTimeout(function () {
      that.setState({tenx: false});
    }, 3000);
    this.setState({tenx: true});
  }

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

    this.ref = base.syncState('games', {
      context: this,
      state: 'games',
      // then: that._loadApp() This callback is called on initial handshake but before any data actually comes back from Firebase
      // --> cannot use it to toggle loading as suggested in the re-base docs
    });

    base.onAuth(function (user) {
      var canUpdateScore = !!(user && user.email === that._scoreboardEmail);
      that.setState({isAuthenticated: canUpdateScore});
      that._shittyUserReset();
    });
  };

  componentWillUnmount() {
    base.removeBinding(this.ref);
    document.removeEventListener("keydown", this._handleButtons.bind(this));
  };

  render() {
    var appEl;

    if (!this.state.game || !(Object.keys(this.state.game).length >= 1)) {
      appEl = <div className="AppLoading">
                <Header
                  auth={this.state.auth}
                  handleAuthenticate={this._handleAuthenticate}
                />
                <LoadingFullScreen />
              </div>;
    } else {
      appEl = (!this.state.tenx) ?
              <div className="App">
                <Header
                  auth={this.state.auth}
                  handleAuthenticate={this._handleAuthenticate}
                />
                <Scoreboard game={this.state.game} />
                <Footer games={this.state.games || "loading"}/>
              </div> :
              <div className="App">
                <Header
                  auth={this.state.auth}
                  handleAuthenticate={this._handleAuthenticate}
                />
                <TenX />
                <Footer games={this.state.games || "loading"}/>
              </div>
              ;
    }

    return appEl

  };
}

export default App;
