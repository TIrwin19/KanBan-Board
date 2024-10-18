import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from '../src/main';

test('renders main component', () => {
  render(<Main />);
  const mainElement = screen.getByTestId('main');
  expect(mainElement).toBeInTheDocument();
});