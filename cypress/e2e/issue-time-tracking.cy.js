import 'cypress-wait-until';

describe('Time Tracking Functionalities: Time Estimation & Time Logging', () => {

    beforeEach(() => {
        // Assuming your authentication token is stored in the environment variables
        const authToken = Cypress.env('authToken');

        // Set the authentication token as a header for every request
        cy.intercept('GET', '/project/board', (req) => {
            req.headers['Authorization'] = `Bearer ${authToken}`;
        });

        // Visit the board and select the specific issue to test
        cy.visit('/project/board');
        cy.url().should('include', '/board');

        // Wait for the body to be loaded
        cy.get('body', { timeout: 60000 }).should('exist');

        // Ensure that the modal is fully loaded
        cy.contains('This is an issue of type: Task.').click();
    });

    // Helper functions
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    const getTimeEstimationField = () => cy.get('input[placeholder="Number"].sc-dxgOiQ.HrhWu');
    const getTimeSpentField = () => cy.get('input[placeholder="Number"].sc-dxgOiQ.HrhWu').eq(0);
    const getTimeRemainingField = () => cy.get('input[placeholder="Number"].sc-dxgOiQ.HrhWu').eq(1);
    const getTimeTrackingSection = () => cy.get('.sc-gHboQg.cTinVM').should('exist').and('be.visible');
    const getStopwatchIcon = () => cy.get('[data-testid="icon:stopwatch"]').should('exist').and('be.visible');
    const getDoneButton = () => cy.get('button.sc-bwzfXH.dIxFno').contains('Done').should('exist').and('be.visible');

    // API Request Example
    it('Should successfully fetch issue details via API', () => {
        cy.request({
            method: 'GET',
            url: '/issues/2602871',
            headers: {
                Authorization: `Bearer ${Cypress.env('authToken')}`
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            cy.log('API Request Successful');
            cy.log('Response:', response.body);
        });
    });

    // Test case for adding, editing, and removing time estimation
    it('Should add, edit, and remove time estimation successfully', () => {
        const initialEstimation = "10";
        const updatedEstimation = "20";

        getIssueDetailsModal().within(() => {
            getTimeTrackingSection().should('exist').and('be.visible');
            cy.log('Adding initial estimation');
            getTimeEstimationField().scrollIntoView().clear({ force: true }).type(initialEstimation, { force: true });
            cy.wait(1000);
        });

        cy.reload();
        getIssueDetailsModal().within(() => {
            cy.log('Validating initial estimation');
            getTimeEstimationField().should('have.value', initialEstimation);
        });

        getIssueDetailsModal().within(() => {
            cy.log('Editing the estimation');
            getTimeEstimationField().scrollIntoView().clear({ force: true }).type(updatedEstimation, { force: true });
            cy.wait(1000);
        });

        cy.reload();
        getIssueDetailsModal().within(() => {
            cy.log('Validating updated estimation');
            getTimeEstimationField().should('have.value', updatedEstimation);
        });

        getIssueDetailsModal().within(() => {
            cy.log('Removing the estimation');
            getTimeEstimationField().scrollIntoView().clear({ force: true });
            cy.wait(1000);
        });

        cy.reload();
        getIssueDetailsModal().within(() => {
            cy.log('Validating estimation removal');
            getTimeEstimationField().should('have.value', '');
        });
    });

    it('Should log time and remove logged time successfully', () => {
        const timeSpent = "2";
        const timeRemaining = "5";

        getIssueDetailsModal().within(() => {
            cy.get('body').then($body => {
                const overlay = $body.find('.sc-jTzLTM.bBEgKU');
                if (overlay.length > 0) {
                    cy.log('Overlay found, hiding it');
                    cy.wrap(overlay).invoke('css', 'display', 'none');
                } else {
                    cy.log('No overlay found, continuing with the test');
                }
            });

            getTimeSpentField().scrollIntoView().should('exist').and('be.visible');
            getTimeRemainingField().scrollIntoView().should('exist').and('be.visible');

            cy.log('Entering Time Spent');
            getTimeSpentField().clear({ force: true }).type(timeSpent, { force: true });
            cy.log('Entering Time Remaining');
            getTimeRemainingField().clear({ force: true }).type(timeRemaining, { force: true });
            cy.log('Clicking Done button');
            getDoneButton().click({ force: true });
        });

        cy.reload();
        getIssueDetailsModal().within(() => {
            cy.log('Validating logged time');
            cy.get(timeTrackingModal).should('contain', `${timeSpent}h logged`).and('contain', `${timeRemaining}h remaining`);
        });

        getIssueDetailsModal().within(() => {
            cy.get(timeTrackingButton).click();
            cy.wait(1000);
            cy.log('Removing logged time');
            getTimeSpentField().scrollIntoView().clear({ force: true });
            getTimeRemainingField().scrollIntoView().clear({ force: true });
            getDoneButton().click({ force: true });
        });

        cy.reload();
        getIssueDetailsModal().within(() => {
            cy.log('Validating logged time removal');
            cy.get(timeTrackingModal).should('not.contain', `${timeSpent}h logged`).and('contain', 'Original Estimate');
        });
    });
});
