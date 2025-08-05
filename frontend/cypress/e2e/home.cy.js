// cypress/e2e/home_spec.js

describe('Portfolio Home Page', () => {
  it('successfully loads and displays content', () => {
    // Replace with your local dev server URL
    // cy.visit('http://localhost:3000');

    // // Check if heading is visible
    cy.contains('Hello, I\'m Girija Prasad Kandel').should('be.visible');

    // // Check if welcome paragraph is visible
    // cy.contains('Welcome to my portfolio').should('be.visible');

    // // Check if "Learn More About Me" link works
    // cy.get('a.btn').contains('Learn More About Me').should('have.attr', 'href', '/about');
  });
});
