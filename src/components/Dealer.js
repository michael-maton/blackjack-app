import React from "react";
import { v4 as uuid } from "uuid";

export default function Dealer(props) {
  return (
    <div className="cards">
      {/* <h3>Dealer's cards:</h3> */}
      {props.cards.map((item) => {
        return(<img key={uuid()} src={item.image} alt={item.image} />);
      })}
      {/* <p>Total: {props.total}</p> */}
    </div>
  );
}
