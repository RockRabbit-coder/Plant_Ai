import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';
import '../i18n/i18n';

describe('PlantCare AI Application', () => {
  it('renders application navigation and brand name', () => {
    render(<App />);
    const brandElements = screen.getAllByText(/PlantCare/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('renders hero headline', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
