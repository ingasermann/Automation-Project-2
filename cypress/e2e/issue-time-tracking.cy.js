describe('Time Tracking Functionalities: Time Estimation & Time Logging', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const getTimeEstimationField = () => cy.get('input[placeholder="Number"]').first();
    const getTimeSpentField = () => cy.get('input[placeholder="Number"]').eq(0);
    const getTimeRemainingField = () => cy.get('input[placeholder="Number"]').eq(0);
    const getStopwatchIcon = () => cy.get('[data-testid="icon:stopwatch"]');
    const getCloseIcon = () => cy.get('[data-testid="icon:close"]').first();
    const getDoneButton = () => cy.contains('button', 'Done');

    it('Should add, edit, and remove time estimation successfully', () => {
        const initialEstimation = "8";
        const updatedEstimation = "10";

        cy.contains('This is an issue of type: Task.').click();

        // Log the state of the DOM after clicking the issue
        cy.wait(1000);
        cy.get('body').then(($body) => {
            cy.log($body.html());
            if ($body.find('[data-testid="modal:issue-details"]').length > 0) {
                cy.log('Modal found in DOM.');
                getIssueDetailsModal().should('be.visible');
            } else {
                cy.log('Modal not found.');
            }
        });

        // Proceed only if the modal is visible
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);

        cy.get('input[placeholder="Number"]').then($els => {
            cy.log('Number of elements with placeholder "Number":', $els.length);
        });

        getIssueDetailsModal().within(() => {
            getTimeEstimationField().clear({ force: true });
            cy.wait(1000);
            getTimeEstimationField().type(initialEstimation, { force: true });
            cy.wait(1000);
            getCloseIcon().click({ force: true });
        });

        cy.wait(1000);
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().should('have.value', initialEstimation);
        });

        getIssueDetailsModal().within(() => {
            getTimeEstimationField().clear({ force: true });
            cy.wait(1000);
            getTimeEstimationField().type(updatedEstimation, { force: true });
            cy.wait(1000);
            getCloseIcon().click({ force: true });
        });

        cy.wait(1000);
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().should('have.value', updatedEstimation);
        });

        getIssueDetailsModal().within(() => {
            getTimeEstimationField().clear({ force: true });
            cy.wait(1000);
            getTimeEstimationField().should('have.value', '');
            getCloseIcon().click({ force: true });
        });

        cy.wait(1000);
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().should('have.value', '');
        });
    });

    it('Should log time and remove logged time successfully', () => {
        const timeSpent = "2";
        const timeRemaining = "5";

        cy.contains('This is an issue of type: Task.').click();

        // Log the state of the DOM after clicking the issue
        cy.wait(1000);
        cy.get('body').then(($body) => {
            cy.log($body.html());
            if ($body.find('[data-testid="modal:issue-details"]').length > 0) {
                cy.log('Modal found in DOM.');
                getIssueDetailsModal().should('be.visible');
            } else {
                cy.log('Modal not found.');
            }
        });

        // Proceed only if the modal is visible
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);

        cy.get('input[placeholder="Number"]').then($els => {
            cy.log('Number of elements with placeholder "Number":', $els.length);
        });

        getIssueDetailsModal().within(() => {
            getStopwatchIcon().click();
            cy.wait(1000);
            getTimeSpentField().clear({ force: true });
            cy.wait(1000);
            getTimeSpentField().type(timeSpent, { force: true });
            cy.wait(1000);
            getTimeRemainingField().clear({ force: true });
            cy.wait(1000);
            getTimeRemainingField().type(timeRemaining, { force: true });
            cy.get('button').contains('Done').click({ force: true });
        });

        cy.wait(1000);
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);
        getIssueDetailsModal().within(() => {
            getStopwatchIcon().click();
            getTimeSpentField().should('have.value', timeSpent);
            getTimeRemainingField().should('have.value', timeRemaining);
        });

        getIssueDetailsModal().within(() => {
            getStopwatchIcon().click();
            cy.wait(1000);
            getTimeSpentField().clear({ force: true });
            getTimeSpentField().should('have.value', '');
            cy.wait(1000);
            getTimeRemainingField().clear({ force: true });
            getTimeRemainingField().should('have.value', '');
            getDoneButton().should('be.visible').click({ force: true });
        });

        cy.wait(1000);
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
        cy.wait(1000);
        getIssueDetailsModal().within(() => {
            getTimeSpentField().should('have.value', '');
            getTimeRemainingField().should('have.value', '');
        });
    });
});