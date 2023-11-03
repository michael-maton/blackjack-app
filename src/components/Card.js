import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Player from './Player';
import Dealer from './Dealer';
import Loader from 'react-loader-spinner';
import './Card.css';

import {
  getPlayerCard,
  getDeck,
  dealCards,
  startNewGame,
  decrementAce,
} from '../actions';

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
  aceActive,
  getPlayerCard,
  getDeck,
  dealCards,
  startNewGame,
  decrementAce,
}) => {
  const [gameOver, setGameOver] = useState(false);
  const [playerLose, setPlayerLose] = useState(false);
  const [_, setNewPlayerTotal] = useState(null);
  const [playerWin, setPlayerWin] = useState(false);
  const message = playerLose ? 'You Lose!' : playerWin ? 'You Win' : '';

  useEffect(() => {
    const evaluateWinner = () => {
      if (playerTotal > 21) {
        if (aceActive === 0) {
          setPlayerLose(true);
          setGameOver(true);
        }
        if (aceActive > 0) {
          decrementAce();
        }
      }
      checkforLimit();
    };
    if (playerTotal) {
      evaluateWinner();
    }
  }, [playerTotal, aceActive, cardsRemaining]);

  if (error) {
    return <h2>{error.message}</h2>;
  }
  if (isShuffling) {
    return (
      <h2>
        Shuffling deck...
        <Loader
          className="shuffling"
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
  }

  const checkforLimit = () => {
    if (playerTotal === 21) {
      if (dealerTotal === playerTotal) {
        setPlayerLose(true);
        setGameOver(true);
      } else {
        setPlayerWin(true);
        setGameOver(true);
      }
    }
  };

  const handleGetDeck = () => {
    getDeck();
  };
  const handleDealCards = () => {
    dealCards(deckID);
  };
  const handlePlayerHit = () => {
    getPlayerCard(deckID);
    setNewPlayerTotal((playerTotal) => playerTotal);
  };
  const handleStay = () => {
    if (playerTotal < 21) {
      if (playerTotal > dealerTotal) {
        setPlayerWin(true);
        setGameOver(true);
      }
    }
    checkforLimit();
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setPlayerLose(false);
    setPlayerWin(false);
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
      {playerLose ? <div className="busted">{message}</div> : null}
      {playerWin ? <div className="busted">{message}</div> : null}
      <div className="player-cards">
        {playerCards ? <Player cards={playerCards} /> : null}
        {playerCards ? <p>Total: {playerTotal}</p> : null}
      </div>
      {playerCards && !gameOver && cardsRemaining >= 4 ? (
        <button onClick={handlePlayerHit}>Hit</button>
      ) : null}
      {playerCards && !gameOver && cardsRemaining >= 4 ? (
        <button onClick={handleStay}>Stay</button>
      ) : null}
      {deckID && cardsRemaining >= 4 ? null : (
        <button onClick={handleGetDeck}>Get New Deck</button>
      )}
      {deckID && !playerCards && cardsRemaining >= 4 ? (
        <button onClick={handleDealCards}>Deal Cards</button>
      ) : null}
      {gameOver || error || playerLose || playerWin ? (
        <button onClick={handlePlayAgain}>Play Again</button>
      ) : null}
      {deckID && cardsRemaining >= 4 ? (
        <span>Cards remaining in deck: {cardsRemaining}</span>
      ) : null}
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
    aceActive: state.aceActive,
  };
};

export default connect(mapStateToProps, {
  getPlayerCard,
  getDeck,
  dealCards,
  startNewGame,
  decrementAce,
})(Card);
