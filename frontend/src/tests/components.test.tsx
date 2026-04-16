/**
 * Frontend Unit Tests — Pure/presentational components
 * These components have no external dependencies and render predictably.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageTitle from '../components/PageTitle';
import WelcomeMessage from '../components/WelcomeMessage';

// ─── PageTitle ────────────────────────────────────────────────────────────────
describe('PageTitle', () => {
    it('renders the app title', () => {
        render(<PageTitle />);
        expect(screen.getByText('KnightRate')).toBeInTheDocument();
    });

    it('renders an h1 element', () => {
        render(<PageTitle />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('has the correct id attribute', () => {
        render(<PageTitle />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveAttribute('id', 'title');
    });
});

// ─── WelcomeMessage ───────────────────────────────────────────────────────────
describe('WelcomeMessage', () => {
    it('renders the welcome message', () => {
        render(<WelcomeMessage />);
        expect(screen.getByText('Welcome to KnightRate')).toBeInTheDocument();
    });

    it('renders an h1 element', () => {
        render(<WelcomeMessage />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('has the correct id attribute', () => {
        render(<WelcomeMessage />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveAttribute('id', 'title');
    });
});
