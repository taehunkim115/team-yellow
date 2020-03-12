describe ('Test App', () => {

    it ('launches', () => {
      cy.visit ('/');
    });
  });

describe ('Test message', () => {

    it ('opens with you checked in', () => {
      cy.visit ('/');
      cy.get('[data-cy=success-check]').should('contain', 'You CheckedIn!');
    });
});

describe ('Test edit contact', () => {
  
    it('shows close contacts when edit contacts is clicked', () => {
      cy.visit ('/');
      cy.get('[data-cy=edit]').click();
      cy.get('[data-cy=close]').should('contain' ,'Close');
    });
  });