import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Sidebar } from './components/sidebar/sidebar';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Sidebar />
    </Router>
  );
}

export default App;
