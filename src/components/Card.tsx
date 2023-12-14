import { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import {
  restartGame,
  getDeck,
  dealCards,
  getPlayerCard,
  getDealerCard,
} from '../state/card/cardSlice';
import classes from '../styles/Card.module.css';
import { Player } from './Player';
import { Button } from './Button';
const Card = () => {
  const card = useSelector((state: RootState) => state.card);
  const dispatch = useDispatch<AppDispatch>();

  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const winMsg = 'You Win!';
  const loseMsg = 'You Lose!';
  const [playerCount, setPlayerCount] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);
  const [turn, setTurn] = useState('');

  useEffect(() => {
    if (card.playerCards) {
      setPlayerCount(card.playerCards.length);
    }
  }, [card.playerCards]);

  useEffect(() => {
    if (card.dealerCards) {
      setDealerCount(card.dealerCards.length);
    }
  }, [card.dealerCards]);

  useEffect(() => {
    if (turn === 'player') {
      if (card.playerTotal === 21) {
        if (card.dealerTotal === card.playerTotal) {
          setMessage(loseMsg);
          setGameOver(true);
        } else {
          setMessage(winMsg);
          setGameOver(true);
        }
      } else if (card.playerTotal > 21) {
        setMessage(loseMsg);
        setGameOver(true);
      }
    }
  }, [playerCount]);

  useEffect(() => {
    if (turn === 'dealer') {
      if (card.dealerTotal >= 17) {
        checkWin();
      } else {
        dispatch(getDealerCard(card.deckID));
      }
    }
  }, [dealerCount, turn]);

  useEffect(() => {
    if (turn === '') {
      if (card.playerTotal && card.playerTotal > 21) {
        setMessage(loseMsg);
        setGameOver(true);
      }
      if (card.dealerTotal > 21 && card.playerTotal <= 21) {
        setMessage(winMsg);
        setGameOver(true);
      }
      if (card.playerTotal === 21) {
        if (card.dealerTotal === card.playerTotal) {
          setMessage(loseMsg);
          setGameOver(true);
        } else {
          setMessage(winMsg);
          setGameOver(true);
        }
      }
      if (card.dealerTotal === 21) {
        if (card.playerTotal <= card.dealerTotal) {
          setMessage(loseMsg);
          setGameOver(true);
        }
      }
    }
  }, [turn]);

  useEffect(() => {
    if (
      card.playerTotal < 21 &&
      card.dealerTotal < 21 &&
      card.cardsRemaining &&
      card.cardsRemaining < 4
    ) {
      if (card.playerTotal > card.dealerTotal) {
        setMessage(winMsg);
      } else {
        setMessage(loseMsg);
      }
    } else if (
      card.dealerTotal === 21 &&
      card.playerTotal <= card.dealerTotal
    ) {
      setMessage(loseMsg);
    } else if (card.playerTotal === 21 && card.dealerTotal < card.playerTotal) {
      setMessage(winMsg);
    }
  }, [card.cardsRemaining, card.playerTotal, card.dealerTotal]);

  const checkWin = () => {
    if (card.playerTotal > card.dealerTotal || card.dealerTotal > 21) {
      setMessage(winMsg);
      setGameOver(true);
    } else if (card.dealerTotal > card.playerTotal) {
      setMessage(loseMsg);
      setGameOver(true);
    } else {
      setMessage(loseMsg);
      setGameOver(true);
    }
  };

  if (card.error) {
    return <h2>{card.error}</h2>;
  }
  if (card.isShuffling) {
    return (
      <h2>
        Shuffling deck...
        <TailSpin color="#626977" height="100" width="100" />
      </h2>
    );
  }
  if (card.isDealing) {
    return <h2>Dealing cards...</h2>;
  }

  const handleGetDeck = () => {
    setGameOver(false);
    setMessage('');
    dispatch(getDeck());
  };

  const handleDealCards = () => {
    dispatch(dealCards(card.deckID));
  };

  const handlePlayerHit = () => {
    dispatch(getPlayerCard(card.deckID));
    setTurn('player');
  };
  const handleStay = () => {
    if (card.dealerTotal < 17) {
      dispatch(getDealerCard(card.deckID));
    }
    setTurn('dealer');
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setMessage('');
    setTurn('');
    setDealerCount(0);
    setPlayerCount(0);
    dispatch(restartGame());
  };

  return (
    <div className={classes['cards-div']}>
      {card.isFetchingCard ? <h2>Hitting...</h2> : null}
      {card.isFetchingDealerCard ? <h2>Dealer hitting...</h2> : null}
      {message !== '' || (card.cardsRemaining && card.cardsRemaining <= 4) ? (
        <div className={classes.busted}>{message}</div>
      ) : null}
      <div className={classes['cards']}>
        <div className={classes['dealer-cards']}>
          {card.dealerCards ? (
            <Player cards={card.dealerCards} player={'dealer'} />
          ) : null}
          {card.dealerCards ? <p>Total: {card.dealerTotal}</p> : null}
        </div>
        <div className={classes['player-cards']}>
          {card.playerCards ? (
            <Player cards={card.playerCards} player={'user'} />
          ) : null}
          {card.playerCards ? <p>Total: {card.playerTotal}</p> : null}
        </div>
      </div>
      {card.playerCards &&
      !gameOver &&
      message === '' &&
      card.cardsRemaining &&
      card.cardsRemaining >= 4 ? (
        <>
          <Button title="Hit" action={handlePlayerHit} />
          <Button title="Stay" action={handleStay} />
        </>
      ) : null}
      {card.deckID && card.cardsRemaining && card.cardsRemaining >= 4 ? null : (
        <Button title="Get New Deck" action={handleGetDeck} />
      )}
      {card.deckID &&
      !card.playerCards &&
      card.cardsRemaining &&
      !gameOver &&
      card.cardsRemaining >= 4 ? (
        <Button title="Deal Cards" action={handleDealCards} />
      ) : null}
      {card.cardsRemaining &&
      card.cardsRemaining > 4 &&
      (gameOver || card.error || message !== '') ? (
        <Button title="Play Again" action={handlePlayAgain} />
      ) : null}
      {card.deckID && card.cardsRemaining && card.cardsRemaining >= 4 ? (
        <span>Cards remaining in deck: {card.cardsRemaining}</span>
      ) : null}
    </div>
  );
};

export default Card;
