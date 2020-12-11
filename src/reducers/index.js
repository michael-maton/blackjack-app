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
    FETCHING_DEALER_CARD_START,
    FETCHING_DEALER_CARD_SUCCESS,
    FETCHING_DEALER_CARD_FAIL,
    RESTART_GAME,
} from "./../actions";

const initialState = {
  deckID: "",
  cardsRemaining: null,
  isShuffling: false,
  isDealing: false,
  playerCards: null,
  dealerCards: null,
  isFetchingCard: false,
  isFetchingDealerCard: false,
  error: "",
  playerTotal: null,
  dealerTotal: null,
};

const valueConverter = (value) => {
    let newValue = 0;
    if (value === "KING" || value === "QUEEN" || value === "JACK"){
        newValue = 10;
    } else if (value === "ACE") {
        newValue = 11;
    } else {newValue = value}
    return parseInt(newValue);
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_DECK_START:
      return {
        ...state,
        isShuffling: true,
        error: "",
      };
    case FETCHING_DECK_SUCCESS:
      return {
        ...state,
        deckID: action.payload.deck_id,
        cardsRemaining: action.payload.remaining,
        playerCards: null,
        dealerCards: null,
        isShuffling: false,
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
        error: "",
      };
    case DEALING_CARDS_SUCCESS:
        let values = action.payload.map(item => {
            if (item.value === "KING" || item.value === "QUEEN" || item.value === "JACK"){
                item.value = "10";
            } else if (item.value === "ACE") {
                item.value = "11";
            }
            return parseInt(item.value);
        });
        const playerCardValues = values[0] + values[2];
        const dealerCardValues = values[1] + values[3]; 
      return {
        ...state,
        cardsRemaining: state.cardsRemaining-4,
        playerCards: [action.payload[0], action.payload[2]],
        playerTotal: state.playerTotal + playerCardValues, 
        dealerCards: [action.payload[1], action.payload[3]],
        dealerTotal: state.dealerTotal + dealerCardValues, 
        isDealing: false,
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
        error: "",
      };
    case FETCHING_PLAYER_CARD_SUCCESS:
      return {
        ...state,
        cardsRemaining: state.cardsRemaining-1,
        playerCards: [...state.playerCards, action.payload[0]],
        playerTotal: state.playerTotal + valueConverter(action.payload[0].value),
        isFetchingCard: false,
      };
    case FETCHING_PLAYER_CARD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case FETCHING_DEALER_CARD_START:
      return {
        ...state,
        isFetchingDealerCard: true,
        error: "",
      };
    case FETCHING_DEALER_CARD_SUCCESS:
      return {
        ...state,
        cardsRemaining: state.cardsRemaining-1,
        dealerCards: [...state.dealerCards, action.payload[0]],
        dealerTotal: state.dealerTotal + valueConverter(action.payload[0].value),
        isFetchingDealerCard: false,
      };
    case FETCHING_DEALER_CARD_FAIL:
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
            error: "",
        }
    default:
      return state;
  }
};
