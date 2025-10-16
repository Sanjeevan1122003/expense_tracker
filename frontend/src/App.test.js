import { render, screen } from '@testing-library/react';
import App from './App';

test('renders expense tracker app', () => {
  render(<App />);
  const appElement = screen.getByText(/Expense Tracker/i);
  expect(appElement).toBeInTheDocument();
});
