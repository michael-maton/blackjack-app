import axios from 'axios';

export const FETCHING_DECK_START = 'FETCHING_DECK_START';
export const FETCHING_DECK_SUCCESS = 'FETCHING_DECK_SUCCESS';
export const FETCHING_DECK_FAIL = 'FETCHING_DECK_FAIL';

export const getDeck = () => (dispatch) => {
  dispatch({ type: FETCHING_DECK_START });
  setTimeout(() => {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then((res) => {
        dispatch({ type: FETCHING_DECK_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: FETCHING_DECK_FAIL, payload: err });
      });
  }, 3000);
};

export const DEALING_CARDS_START = 'DEALING_CARDS_START';
export const DEALING_CARDS_SUCCESS = 'DEALING_CARDS_SUCCESS';
export const DEALING_CARDS_FAIL = 'DEALING_CARDS_FAIL';

export const dealCards = (deckID) => async (dispatch) => {
  dispatch({ type: DEALING_CARDS_START });
  try {
    let response = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`
    );
    if (response.data.remaining < 15 && response.data.remaining > 4) {
      try {
        await axios.get(
          `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/?remaining=true`
        );
        console.log('shuffled');
        try {
          response = await axios.get(
            `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`
          );
        } catch (err) {
          dispatch({ type: DEALING_CARDS_FAIL, payload: err });
        }
      } catch (err) {
        dispatch({ type: DEALING_CARDS_FAIL, payload: err });
      }
    }
    dispatch({ type: DEALING_CARDS_SUCCESS, payload: response.data });
  } catch (err) {
    dispatch({ type: DEALING_CARDS_FAIL, payload: err });
  }
};

export const FETCHING_PLAYER_CARD_START = 'FETCHING_PLAYER_CARD_START';
export const FETCHING_PLAYER_CARD_SUCCESS = 'FETCHING_PLAYER_CARD_SUCCESS';
export const FETCHING_PLAYER_CARD_FAIL = 'FETCHING_PLAYER_CARD_FAIL';

export const getPlayerCard = (deckID) => (dispatch) => {
  dispatch({ type: FETCHING_PLAYER_CARD_START });
  axios
    .get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then((res) => {
      dispatch({ type: FETCHING_PLAYER_CARD_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: FETCHING_PLAYER_CARD_FAIL, payload: err });
    });
};

export const RESTART_GAME = 'RESTART_GAME';

export const startNewGame = () => (dispatch) => {
  dispatch({ type: RESTART_GAME });
};

export const DECREMENT_ACE = 'DECREMENT_ACE';

export const decrementAce = () => (dispatch) => {
  dispatch({ type: DECREMENT_ACE });
};
