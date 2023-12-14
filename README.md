## Requirements

If you’re not familiar with the game, here are the **simplified rules I will be following for this project.** I know these aren't Blackjack rules exactly, but for simplicity, I am keeping the game rules as limited (even if you're a Blackjack veteran 🃏)**:**

1. The game consists of two players: You vs The House (the computer), where the goal is to beat the The House’s hand, without going over 21
2. A card contains a “point” value equivalent to it’s number (the 3 of club is worth 3 points…the 9 of spades is worth 9 points…etc etc). Face cards (Jack, Queen, King) are worth TEN points, and the Ace card is either worth 1 or 11, whichever is most helpful for the player’s hand. For example:
   1. If the player has a Jack and a Queen, and then draws an Ace, the Ace will be worth 1 point to add up to 21
   2. If the player has a Queen and an Ace, the Ace will be worth 11 points to add up to 21
   3. If the player has a 2 and an Ace, the Ace will be worth 11 points to get closer to 21
   4. If the player has a 2 and a 5, and then draws an Ace, the Ace will be worth 11 points to get closer to 21. If the player then draws a 10, the Ace will now be worth 1 point
3. The House and player are initially dealt TWO face up cards !
4. Then you have one of the following options:
   1. Hit: You are dealt one more card to add to your point value. For this project, the player may hit as many times as they like, until their card value exceeds 21, at which point the game ends in **an automatic loss**
   2. Stand: House will keep drawing new single card until its card value exceeds 17. Once the player hit 'Stand', there is no control of User on the game. Based on drawing each card and once total exceed 17 for the House, the game ends who is more closer to 21.
5. Once you end the round, the game is over, and there should be a display of whether you won or lost
   1. You win if:
      1. The House’s total is > 21 and your total is < 21
      2. Your current total is < 21 but higher than the House’s total
      3. Your current total is 21 and the House’s total is not 21
   2. You lose if:
      1. Your current totals over 21 (don’t forget to factor in the different edge cases of the Ace card!)
      2. You current total is < 21 but lower than the House’s total
      3. You tie with the House

To implement this, you’ll use this API for card management: [http://deckofcardsapi.com/](http://deckofcardsapi.com/). You should be able to initialize one deck and deal out cards from the deck using this API.

## Running the app

To start developing your app just run `npm i` and `npm start`. Start building your app by modifying `src/App.tsx`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
