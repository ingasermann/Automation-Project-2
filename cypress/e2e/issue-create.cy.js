describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it('Should normalize spaces in the issue title', () => {
    const titleWithSpaces = '  Hello    world!  ';
    const normalizedTitle = 'Hello world!';  // Expected normalized title

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("This is a test description.");
      cy.get('input[name="title"]').type(titleWithSpaces);
      cy.get('input[name="title"]').should("have.value", titleWithSpaces);

      // Open issue type dropdown
      cy.get('[data-testid="select:type"]').click();

      // Select a type by its visible text
      cy.contains('Task').should('be.visible').click({ force: true });

      // Set the priority to Medium
      cy.get('[data-testid="select:priority"]').click();
      cy.contains('Medium').should('be.visible').click({ force: true });

      // Select Baby Yoda from the reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.contains('Baby Yoda').should('be.visible').click({ force: true });

      // Click on the "Create issue" button
      cy.get('button[type="submit"]').click();
    });

    // Verify the issue title on the board normalizes spaces
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get('[data-testid="board-list:backlog"]')
      .find('[data-testid="list-issue"]')
      .first()
      .find('p')
      .invoke('text')
      .then((text) => {
        // Normalize spaces in the retrieved text
        const retrievedTitle = text.replace(/\s+/g, ' ').trim();
        expect(retrievedTitle).to.equal(normalizedTitle);
      });
  });
});
