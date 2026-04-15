/**
 * Frontend Unit Tests — ProtectedRoute & Logout components
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Logout from '../components/Logout';

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
describe('ProtectedRoute', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('redirects to "/" when no token is present', () => {
        localStorage.removeItem('token');
        render(
            <MemoryRouter initialEntries={['/home']}>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children when a token is present', () => {
        localStorage.setItem('token', 'fake-jwt-token');
        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
describe('Logout', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('userId', 'fake-user-id');
        // Mock window.location.href assignment
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '/home' },
        });
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('renders the Log Out button', () => {
        render(<Logout />);
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    it('clears token and userId from localStorage on click', () => {
        render(<Logout />);
        fireEvent.click(screen.getByRole('button', { name: /log out/i }));
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userId')).toBeNull();
    });

    it('redirects to "/" after logout', () => {
        render(<Logout />);
        fireEvent.click(screen.getByRole('button', { name: /log out/i }));
        expect(window.location.href).toBe('/');
    });
});
