import React, { useState } from "react";
import { connect } from "react-redux";
import Player from "./Player";
import Dealer from "./Dealer";
import Loader from "react-loader-spinner";

import {
  getPlayerCard,
  getDeck,
  dealCards,
  getDealerCard,
  startNewGame,
} from "../actions";

const Card = ({
  deckID,
  cardsRemaining,
  isShuffling,
  isDealing,
  playerCards,
  dealerCards,
  isFetchingCard,
  isFetchingDealerCard,
  error,
  playerTotal,
  dealerTotal,
  getPlayerCard,
  getDealerCard,
  getDeck,
  dealCards,
  startNewGame,
}) => {
  const [gameOver, setGameOver] = useState(false);
  const [playerBust, setPlayerBust] = useState(false);
  const [newPlayerTotal, setNewPlayerTotal] = useState(null);
  const [newDealerTotal, setNewDealerTotal] = useState(null);

  if (error) {
    return <h2>{error.message}</h2>;
  }
  if (isShuffling) {
    return (
      <h2>
        Shuffling deck...
        <Loader className="shuffling"
          type="Hearts"
          color="#626977"
          height="100"
          width="100"
        />
      </h2>
    );
  }
  if (isDealing) {
    return <h2>Dealing cards...</h2>;
  };

  const handleGetDeck = () => {
    getDeck();
  };
  const handleDealCards = () => {
    dealCards(deckID);
  };
  const handlePlayerHit = () => {
    setNewPlayerTotal(playerTotal);
    console.log(newPlayerTotal);
    if (newPlayerTotal > 21) {
      setPlayerBust(true);
    } else {
      getPlayerCard(deckID);
    }
  };
  const handleDealerHit = () => {
    setNewDealerTotal(dealerTotal);
    if (newDealerTotal < 16) {
      getDealerCard(deckID);
    }
    setGameOver(true);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setPlayerBust(false);
    startNewGame();
  };

  return (
    <div>
      {isFetchingCard ? <h2>Hitting...</h2> : null}
      {isFetchingDealerCard ? <h2>Dealer hitting...</h2> : null}
      <div className="dealer-cards">
        {dealerCards ? <Dealer cards={dealerCards} /> : null}
        {dealerCards ? <p>Total: {dealerTotal}</p> : null}
      </div>
      <div className="player-cards">
        {playerCards ? <Player cards={playerCards} /> : null}
        {playerCards ? <p>Total: {playerTotal}</p> : null}
      </div>
      {playerCards && !gameOver ? <button onClick={handlePlayerHit}>Hit</button> : null}
      {playerCards && !playerBust ? <button onClick={handleDealerHit}>Stay</button> : null}
      {deckID ? null : <button onClick={handleGetDeck}>Get New Deck</button>}
      {deckID && !playerCards ? (
        <button onClick={handleDealCards}>Deal Cards</button>
      ) : null}
      {gameOver || error || playerBust ? (
        <button onClick={handlePlayAgain}>Play Again</button>
      ) : null}
      {deckID ? <span>Cards remaining in deck: {cardsRemaining}</span> : null}
      {playerBust ? <div className="busted">You busted!</div> : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    deckID: state.deckID,
    cardsRemaining: state.cardsRemaining,
    isShuffling: state.isShuffling,
    isDealing: state.isDealing,
    playerCards: state.playerCards,
    dealerCards: state.dealerCards,
    isFetchingCard: state.isFetchingCard,
    isFetchingDealerCard: state.isFetchingDealerCard,
    error: state.error,
    playerTotal: state.playerTotal,
    dealerTotal: state.dealerTotal,
  };
};

export default connect(mapStateToProps, {
  getPlayerCard,
  getDeck,
  dealCards,
  getDealerCard,
  startNewGame,
})(Card);
