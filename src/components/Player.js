import React from 'react';
import { v4 as uuid } from "uuid";

export default function Player(props) {
    return (
        <div className="cards">
            <h3>Your cards:</h3>
            {props.cards.map(item => {
                return (<img key={uuid()} src={item.image} alt={item.image} />)
            })}
            <p>Total: {props.total}</p>
        </div>
    )
}
