import React from 'react';
import { v4 as uuid } from 'uuid';
import classes from './Card.module.css';

export default function Player(props) {
  return (
    <div>
      <h3>Your cards:</h3>
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
  );
}
