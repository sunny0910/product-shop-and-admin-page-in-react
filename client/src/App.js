import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import Login from './components/admin/Login';
import Register from './components/admin/Register';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Login/> */}
        <Register/>
      </div>
    );
  }
}

export default App;
