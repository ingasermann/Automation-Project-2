describe('Time Tracking Functionalities: Time Estimation & Time Logging', () => {
    beforeEach(() => {
        cy.visit('/project/board');
        cy.contains('This is an issue of type: Task.').click();  // Open the issue
    });

    // Helper functions to get elements
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    const getTimeEstimationField = () => cy.get('input[placeholder="Number"].sc-dxgOiQ.HrhWu');

    import 'cypress-wait-until';

    // Wait until the Time Spent field is present and visible
    cy.waitUntil(() =>
        cy.get('input[placeholder="Number"].sc-dxgOiQ.HrhWu').eq(0)
            .should('exist')
            .and('be.visible')
    );

    // Wait until the Time Remaining field is present and visible
    cy.waitUntil(() =>
        cy.get('input[placeholder="Number"].sc-dxgOiQ.HrhWu').eq(1)
            .should('exist')
            .and('be.visible')
    );

    const getTimeTrackingSection = () => cy.get('.sc-gHboQg.cTinVM').should('exist').and('be.visible');
    const getStopwatchIcon = () => cy.get('[data-testid="icon:stopwatch"]').should('exist').and('be.visible');
    const getDoneButton = () => cy.get('button.sc-bwzfXH.dIxFno').contains('Done').should('exist').and('be.visible'); // Adjusted selector for Done button

    // Test case for adding, editing, and removing time estimation
    it('Should add, edit, and remove time estimation successfully', () => {
        const initialEstimation = "10";
        const updatedEstimation = "20";

        // Step 1: Add Estimation
        getIssueDetailsModal().within(() => {
            getTimeTrackingSection().should('exist').and('be.visible');
            getTimeEstimationField().clear({ force: true }).type(initialEstimation, { force: true });
            cy.wait(1000);  // Wait to ensure the estimation is saved
        });

        // Step 2: Validate the added estimation
        cy.reload();
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().should('have.value', initialEstimation);
        });

        // Step 3: Edit Estimation
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().clear({ force: true }).type(updatedEstimation, { force: true });
            cy.wait(1000);  // Wait to ensure the estimation is saved
        });

        // Step 4: Validate the updated estimation
        cy.reload();
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().should('have.value', updatedEstimation);
        });

        // Step 5: Remove Estimation
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().clear({ force: true });
            cy.wait(1000);  // Wait to ensure the estimation is removed
        });

        // Step 6: Validate the estimation is removed
        cy.reload();
        getIssueDetailsModal().within(() => {
            getTimeEstimationField().should('have.value', '');
        });
    });

    // Test case for logging time and removing logged time
    it('Should log time and remove logged time successfully', () => {
        const timeSpent = "2";
        const timeRemaining = "5";

        // Step 1: Log Time
        getIssueDetailsModal().within(() => {
            getStopwatchIcon().click();
            cy.wait(1000);  // Ensure the time fields are loaded

            // Log the number of input fields and their indices
            cy.get('input[placeholder="Number"]').then($inputs => {
                cy.log('Number of input fields with placeholder "Number":', $inputs.length);
                $inputs.each((index, input) => {
                    cy.log(`Input at index ${index} has value: ${input.value}`);
                });
            });

            getTimeSpentField().clear({ force: true }).type(timeSpent, { force: true });
            getTimeRemainingField().clear({ force: true }).type(timeRemaining, { force: true });
            getDoneButton().click({ force: true });
        });

        // Step 2: Validate the logged time
        cy.reload();
        getIssueDetailsModal().within(() => {
            getTimeTrackingSection().should('contain', `${timeSpent}h logged`).and('contain', `${timeRemaining}h remaining`);
        });

        // Step 3: Remove Logged Time
        getIssueDetailsModal().within(() => {
            getStopwatchIcon().click();
            cy.wait(1000);  // Ensure the time fields are loaded
            getTimeSpentField().clear({ force: true });

            getTimeRemainingField().clear({ force: true });
            getDoneButton().click({ force: true });
        });

        // Step 4: Validate the logged time is removed
        cy.reload();
        getIssueDetailsModal().within(() => {
            getTimeTrackingSection().should('not.contain', `${timeSpent}h logged`).and('contain', 'Original Estimate');
        });
    });
});