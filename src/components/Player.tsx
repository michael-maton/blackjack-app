import React from 'react';
import { v4 as uuid } from 'uuid';
import classes from '../styles/Card.module.css';
import { CardType } from '../types';

interface Cards {
  cards: Array<CardType>;
  player: string;
}

export const Player = (props: Cards) => {
  return (
    <>
      <div>
        {props.player === 'dealer' ? (
          <h3>Dealer's cards:</h3>
        ) : (
          <h3>Your cards:</h3>
        )}
      </div>
      <div style={{ display: 'flex', flexFlow: 'row' }}>
        {props.cards.map((item) => {
          return (
            <img
              key={uuid()}
              src={item.image}
              alt={item.image}
              className={classes.img}
            />
          );
        })}
      </div>
    </>
  );
};
