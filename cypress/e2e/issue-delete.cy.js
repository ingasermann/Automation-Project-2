describe("Issue deletion", () => {
    beforeEach(() => {
      // Navigate to the Jira board and open the first issue
      cy.visit("/");
      cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`).then((url) => {
        cy.visit(url + "/board");
        cy.get('[data-testid="list-issue"]').first().click(); // Open the first issue
      });
  
      // Assert that the issue detail view modal is visible
      cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    });
  
    // Test Case 1: Issue Deletion
    it("Should delete an issue and verify it's no longer on the board", () => {
      // Click the delete button
      cy.get('[data-testid="icon:trash"]').click();
  
      // Confirm deletion in the pop-up
      cy.get('[data-testid="modal:confirm"]').contains("Delete issue").click();
  
      // Assert that the deletion confirmation dialogue is not visible
      cy.get('[data-testid="modal:confirm"]').should("not.exist");
  
      // Assert that the issue is deleted and no longer displayed on the board
      cy.get('[data-testid="board-list:backlog"]').should("not.contain", "Bug");
    });
  
// Test Case 2: Issue Deletion Cancellation
it("Should cancel issue deletion and verify the issue is still on the board", () => {
    // Assert the visibility of the issue detail view modal
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
  
    // Click the Delete Issue button
    cy.get('[data-testid="icon:trash"]').click();
  
    // Cancel the deletion in the confirmation pop-up
    cy.get('[data-testid="modal:confirm"]').contains("Cancel").click();
  
    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
  
    // Ensure the board reloads and contains the issue
    cy.reload();
  
    // Wait for the board to be ready and display the issues
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
  
    // Assert that the issue is not deleted and is still displayed on the Jira board
    cy.get('[data-testid="board-list:backlog"]').should("contain.text", "Task");
  });
});