// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App shell', () => {
  it('always shows the exploratory-use disclaimer', () => {
    render(<App />);
    expect(screen.getByRole('note').textContent).toMatch(/^Exploratory design and cost comparison only\./);
  });
});
