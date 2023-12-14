import React from 'react';
import classes from './styles/App.module.css';
import Card from './components/Card';

function App() {
  return (
    <div className={classes.App}>
      <div className={classes['App-header']}>
        <h2>Blackjack!</h2>
        <Card />
      </div>
    </div>
  );
}

export default App;
