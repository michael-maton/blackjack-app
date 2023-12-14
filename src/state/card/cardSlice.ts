import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { CardType, DeckResp } from '../../types';

interface CardState {
  deckID: string;
  cardsRemaining: number | null;
  isShuffling: boolean;
  isDealing: boolean;
  playerCards: Array<CardType> | null;
  dealerCards: Array<CardType> | null;
  isFetchingCard: boolean;
  isFetchingDealerCard: boolean;
  error: string;
  playerTotal: number;
  dealerTotal: number;
  playerAce: number;
  delaerAce: number;
}

const initialState: CardState = {
  deckID: '',
  cardsRemaining: null,
  isShuffling: false,
  isDealing: false,
  playerCards: null,
  dealerCards: null,
  isFetchingCard: false,
  isFetchingDealerCard: false,
  error: '',
  playerTotal: 0,
  dealerTotal: 0,
  playerAce: 0,
  delaerAce: 0,
};

export const getDeck = createAsyncThunk('card/getDeck', async () => {
  try {
    let response = await axios.get(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
    return response.data;
  } catch (err) {
    return err;
  }
});

export const dealCards = createAsyncThunk(
  'card/dealCards',
  async (deckID: string) => {
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
            return err;
          }
        } catch (err) {
          return err;
        }
      }
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const getPlayerCard = createAsyncThunk(
  'card/getPlayerCard',
  async (deckID: string) => {
    try {
      let response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const getDealerCard = createAsyncThunk(
  'card/getDealerCard',
  async (deckID: string) => {
    try {
      let response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

const valueConverter = (value: string) => {
  let newValue = 0;
  if (value === 'KING' || value === 'QUEEN' || value === 'JACK') {
    newValue = 10;
  } else if (value === 'ACE') {
    newValue = 11;
  } else {
    newValue = parseInt(value);
  }
  return newValue;
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    restartGame: (state) => {
      state.playerCards = null;
      state.dealerCards = null;
      state.playerTotal = 0;
      state.dealerTotal = 0;
      state.error = '';
      state.playerAce = 0;
      state.delaerAce = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeck.pending, (state) => {
        state.isShuffling = true;
        state.error = '';
      })
      .addCase(getDeck.fulfilled, (state, action: PayloadAction<DeckResp>) => {
        state.deckID = action.payload.deck_id;
        state.cardsRemaining = action.payload.remaining;
        state.playerCards = null;
        state.dealerCards = null;
        state.isShuffling = false;
        state.playerTotal = 0;
        state.dealerTotal = 0;
        state.error = '';
        state.playerAce = 0;
        state.delaerAce = 0;
      })
      .addCase(getDeck.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      .addCase(dealCards.pending, (state) => {
        state.isDealing = true;
        state.error = '';
      })
      .addCase(
        dealCards.fulfilled,
        (state, action: PayloadAction<DeckResp>) => {
          const calculate = (
            total: number,
            cards: Array<CardType>,
            user: string,
            state: CardState
          ): number => {
            cards.forEach((card: CardType) => {
              if (
                card.value !== 'ACE' &&
                (card.value === 'KING' ||
                  card.value === 'QUEEN' ||
                  card.value === 'JACK')
              ) {
                total += Number('10');
              } else if (card.value === 'ACE') {
                const aces = cards.filter((card: CardType) => {
                  return card.value === 'ACE';
                });
                if (total + 11 > 21) {
                  total += 1;
                } else if (total + 11 === 21) {
                  if (aces.length > 1) {
                    total += 1;
                  } else {
                    total += 11;
                    user === 'player'
                      ? (state.playerAce += 1)
                      : (state.delaerAce += 1);
                  }
                } else {
                  total += 11;
                  user === 'player'
                    ? (state.playerAce += 1)
                    : (state.delaerAce += 1);
                }
              } else {
                total += Number(card.value);
              }
            });
            return total;
          };
          state.cardsRemaining = action.payload.remaining;
          state.playerCards = [
            action.payload.cards[0],
            action.payload.cards[2],
          ];
          state.playerTotal = calculate(
            state.playerTotal,
            state.playerCards,
            'player',
            state
          );
          state.dealerCards = [
            action.payload.cards[1],
            action.payload.cards[3],
          ];
          state.dealerTotal = calculate(
            state.dealerTotal,
            state.dealerCards,
            'dealer',
            state
          );
          state.isDealing = false;
        }
      )
      .addCase(dealCards.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      .addCase(getPlayerCard.pending, (state) => {
        state.isFetchingCard = true;
        state.error = '';
      })
      .addCase(
        getPlayerCard.fulfilled,
        (state, action: PayloadAction<DeckResp>) => {
          const calculateTotal = (state: any, value: number) => {
            if (state.playerAce > 0 && state.playerTotal + value > 21) {
              state.playerTotal = state.playerTotal - 10 + value;
              state.playerAce -= 1;
            } else if (state.playerAce > 0 && state.playerTotal + value < 21) {
              state.playerTotal = state.playerTotal + value;
            } else if (
              state.playerAce === 0 &&
              state.playerTotal + value > 21
            ) {
              if (value === 11) {
                state.playerTotal = state.playerTotal + 1;
                // state.playerAce += 1;
              } else {
                state.playerTotal = state.playerTotal + value;
              }
            } else {
              state.playerTotal = state.playerTotal + value;
            }
            return state.playerTotal;
          };

          state.cardsRemaining = action.payload.remaining;
          state.playerCards = state.playerCards && [
            ...state.playerCards,
            action.payload.cards[0],
          ];
          state.playerTotal = calculateTotal(
            state,
            valueConverter(action.payload.cards[0].value)
          );
          state.isFetchingCard = false;
        }
      )
      .addCase(getPlayerCard.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      .addCase(getDealerCard.pending, (state) => {
        state.isFetchingDealerCard = true;
        state.error = '';
      })
      .addCase(getDealerCard.fulfilled, (state, action) => {
        const calculateTotal = (state: any, value: number) => {
          if (state.delaerAce > 0 && state.dealerTotal + value > 21) {
            state.dealerTotal = state.dealerTotal - 10 + value;
            state.delaerAce -= 1;
          } else if (state.delaerAce > 0 && state.dealerTotal + value < 21) {
            state.dealerTotal = state.dealerTotal + value;
          } else if (state.delaerAce === 0 && state.dealerTotal + value > 21) {
            if (value === 11) {
              state.dealerTotal = state.dealerTotal + 1;
              // state.delaerAce += 1;
            } else {
              state.dealerTotal = state.dealerTotal + value;
            }
          } else {
            state.dealerTotal = state.dealerTotal + value;
          }
          return state.dealerTotal;
        };
        state.cardsRemaining = action.payload.remaining;
        state.dealerCards =
          state.dealerTotal < 21
            ? state.dealerCards && [
                ...state.dealerCards,
                action.payload.cards[0],
              ]
            : state.dealerCards;
        state.dealerTotal =
          state.dealerTotal < 21
            ? calculateTotal(
                state,
                valueConverter(action.payload.cards[0].value)
              )
            : state.dealerTotal;
        state.isFetchingDealerCard = false;
      })
      .addCase(getDealerCard.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export const { restartGame } = cardSlice.actions;

export default cardSlice.reducer;
