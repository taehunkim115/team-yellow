describe ('Test App', () => {

    it ('launches', () => {
      cy.visit ('/');
    });
  });

describe ('Test App', () => {

    it ('launches', () => {
      cy.visit ('/');
    });
  
    it ('opens with you checked in', () => {
      cy.visit ('/');
      cy.get('[data-cy=success-check]').should('contain', 'You CheckedIn!');
    });
});