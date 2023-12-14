export type CardType = {
  code: string;
  image: string;
  images: object;
  value: string;
  suit: string;
};

export type DeckResp = {
  success: boolean;
  deck_id: string;
  cards: Array<CardType>;
  remaining: number;
};

export type ButtonType = {
  title: string;
  action: React.MouseEventHandler<HTMLButtonElement>;
};
