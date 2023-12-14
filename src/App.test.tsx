import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Blackjack', () => {
  render(<App />);
  const linkElement = screen.getByText(/Blackjack/i);
  expect(linkElement).toBeInTheDocument();
});
