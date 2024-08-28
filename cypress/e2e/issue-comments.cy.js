describe('Comprehensive Test: Create, Edit, and Delete a Comment', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    // Helper functions
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const getCommentInsertionField = () => cy.get('textarea[placeholder="Add a comment..."]');
    const getSavedCommentField = () => cy.get('[data-testid="issue-comment"]');
    const getSaveButton = () => cy.contains('button', 'Save');
    const getDeleteButton = () => cy.contains('button', 'Delete');
    const getDeletionConfirmationModal = () => cy.get('[data-testid="modal:confirm"]');

    it('Should create, edit, and delete the edited comment successfully and verify its removal', () => {
        const initialComment = "This comprehensive test begins with Ingas added comment";
        const updatedComment = "This comprehensive test continues with Ingas edited comment";

        // Step 1: Add a comment
        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(initialComment);
            cy.contains('button', 'Save').click().should('not.exist');

            // Step 2: Assert that the comment has been added and is visible
            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', initialComment);

            // Step 3: Edit the added comment
            cy.get('[data-testid="issue-comment"]')
                .contains(initialComment)
                .parent()
                .within(() => {
                    cy.contains('Edit').click();
                });

            cy.get('textarea[placeholder="Add a comment..."]')
                .clear()
                .type(updatedComment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            // Step 4: Assert that the updated comment is visible
            cy.get('[data-testid="issue-comment"]').should('contain', updatedComment);
        });

        // Step 5: Delete the edited comment
        cy.get('[data-testid="issue-comment"]')
            .contains(updatedComment)
            .parent()
            .within(() => {
                cy.contains('Delete').click();
            });

        // Adding a wait here to ensure the confirmation modal appears
        cy.get('[data-testid="modal:confirm"]').should('be.visible');

        // Step 6: Confirm the deletion and assert that the comment is removed
        getDeletionConfirmationModal().within(() => {
            cy.contains('button', 'Delete comment').click().should('not.exist');
        });

        // Assert that the comment is no longer visible
        getIssueDetailsModal().find('[data-testid="issue-comment"]').should('not.contain', updatedComment);
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'This comprehensive test continues with Ingas edited comment';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]').should('be.visible');

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });
});