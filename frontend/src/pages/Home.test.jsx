// src/pages/Home.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

describe('Home Component', () => {
    test('renders heading with your name', () => {
        render(<Home />);
        const heading = screen.getByRole('heading', { name: /Hello, I'm Girija Prasad Kandel/i });
        expect(heading).toBeInTheDocument();
    });

    test('renders welcome paragraph', () => {
        render(<Home />);
        const paragraph = screen.getByText(/Welcome to my portfolio. I am a passionate web developer/i);
        expect(paragraph).toBeInTheDocument();
    });

    test('renders Learn More About Me link', () => {
        render(<Home />);
        const link = screen.getByRole('link', { name: /Learn More About Me/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/about');
    });
});
