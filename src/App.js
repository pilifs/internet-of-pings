import React, { Component } from 'react';
import Scoreboard from './Scoreboard';
import Footer from './Footer';
import Header from './Header';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Scoreboard />
        <Footer />
      </div>
    );
  };
}

export default App;
