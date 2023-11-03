import {
  FETCHING_DECK_START,
  FETCHING_DECK_SUCCESS,
  FETCHING_DECK_FAIL,
  DEALING_CARDS_START,
  DEALING_CARDS_SUCCESS,
  DEALING_CARDS_FAIL,
  FETCHING_PLAYER_CARD_START,
  FETCHING_PLAYER_CARD_SUCCESS,
  FETCHING_PLAYER_CARD_FAIL,
  RESTART_GAME,
  DECREMENT_ACE,
} from './../actions';

const initialState = {
  deckID: '',
  cardsRemaining: null,
  isShuffling: false,
  isDealing: false,
  playerCards: null,
  dealerCards: null,
  isFetchingCard: false,
  isFetchingDealerCard: false,
  error: '',
  playerTotal: null,
  dealerTotal: null,
  aceActive: 0,
};

const valueConverter = (value) => {
  let newValue = 0;
  if (value === 'KING' || value === 'QUEEN' || value === 'JACK') {
    newValue = 10;
  } else if (value === 'ACE') {
    newValue = 11;
  } else {
    newValue = value;
  }
  return parseInt(newValue);
};

const calculateTotal = (state, value) => {
  if (state.aceActive > 0 && state.playerTotal + value > 21) {
    state.playerTotal = state.playerTotal - 10 + value;
    state.aceActive -= 1;
  } else if (state.aceActive > 0 && state.playerTotal + value < 21) {
    state.playerTotal = state.playerTotal + value;
  } else if (state.aceActive === 0 && state.playerTotal + value > 21) {
    if (value === 11) {
      state.playerTotal = state.playerTotal + 1;
      state.aceActive += 1;
    } else {
      state.playerTotal = state.playerTotal + value;
    }
  } else {
    state.playerTotal = state.playerTotal + value;
  }
  return state.playerTotal;
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_DECK_START:
      return {
        ...state,
        isShuffling: true,
        error: '',
      };
    case FETCHING_DECK_SUCCESS:
      return {
        ...state,
        deckID: action.payload.deck_id,
        cardsRemaining: action.payload.remaining,
        playerCards: null,
        dealerCards: null,
        isShuffling: false,
        playerTotal: null,
        dealerTotal: null,
        error: '',
        aceActive: 0,
      };
    case FETCHING_DECK_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DEALING_CARDS_START:
      return {
        ...state,
        isDealing: true,
        error: '',
      };
    case DEALING_CARDS_SUCCESS:
      let values = action.payload.cards.map((item) => {
        if (
          item.value === 'KING' ||
          item.value === 'QUEEN' ||
          item.value === 'JACK'
        ) {
          item.value = '10';
        } else if (item.value === 'ACE') {
          item.value = '11';
        }
        return parseInt(item.value);
      });
      const playerCardValues = values[0] + values[2];
      const dealerCardValues = values[1] + values[3];
      return {
        ...state,
        cardsRemaining: action.payload.remaining,
        playerCards: [action.payload.cards[0], action.payload.cards[2]],
        playerTotal: state.playerTotal + playerCardValues,
        dealerCards: [action.payload.cards[1], action.payload.cards[3]],
        dealerTotal: state.dealerTotal + dealerCardValues,
        isDealing: false,
        aceActive: [action.payload.cards[0], action.payload.cards[2]].some(
          (item) => item.value === '11'
        )
          ? state.aceActive + 1
          : state.aceActive,
      };
    case DEALING_CARDS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case FETCHING_PLAYER_CARD_START:
      return {
        ...state,
        isFetchingCard: true,
        error: '',
      };
    case FETCHING_PLAYER_CARD_SUCCESS:
      return {
        ...state,
        cardsRemaining: action.payload.remaining,
        playerCards: [...state.playerCards, action.payload.cards[0]],
        playerTotal: calculateTotal(
          state,
          valueConverter(action.payload.cards[0].value)
        ),
        // state.playerTotal + valueConverter(action.payload[0].value),
        isFetchingCard: false,
        aceActive:
          action.payload.cards[0].value === '11'
            ? state.aceActive + 1
            : state.aceActive,
      };
    case FETCHING_PLAYER_CARD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case RESTART_GAME:
      return {
        ...state,
        playerCards: null,
        dealerCards: null,
        playerTotal: null,
        dealerTotal: null,
        error: '',
        aceActive: 0,
      };
    case DECREMENT_ACE:
      return {
        ...state,
        playerTotal: state.playerTotal - 10,
        aceActive: state.aceActive - 1,
      };
    default:
      return state;
  }
};
