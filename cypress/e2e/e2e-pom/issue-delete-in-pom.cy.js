
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  let issueTitle = '';

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      // Log all issue titles for debugging
      cy.get('[data-testid="list-issue"]').each(($el) => {
        cy.log($el.text()); // Log each issue title
      });

      // Grab the title of the first issue and set it as the issueTitle variable
      cy.get('[data-testid="list-issue"]').first().invoke('text').then((text) => {
        issueTitle = text.trim();
        cy.contains(issueTitle).click();
      });
    });
  });

  // Test Case 1: Issue Deletion using POM
  it('Should delete issue successfully', () => {
    // Ensure the issue detail view modal is visible
    IssueModal.getIssueDetailModal().should('be.visible');

    // Click the delete button and confirm deletion
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();

    // Assert that the issue is deleted and no longer displayed on the board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  // Test Case 2: Issue Deletion Cancellation using POM
  it('Should cancel deletion process successfully', () => {
    // Ensure the issue detail view modal is visible
    IssueModal.getIssueDetailModal().should('be.visible');

    // Click the delete button and cancel deletion
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();

    // Ensure the issue detail modal is closed after cancellation
    IssueModal.closeDetailModal();

    // Assert that the issue is not deleted and is still displayed on the board
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});