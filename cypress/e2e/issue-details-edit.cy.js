describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  it('Should validate priority dropdown values and reporter name', () => {
    const expectedLength = 5;
    let prioritiesArray = [];

    getIssueDetailsModal().within(() => {
      // Step 1: Validate the Priority dropdown values

      // Click to open the Priority dropdown
      cy.get('[data-testid="select:priority"]').click('bottomRight');

      // Get the initially selected priority value and push it into the array
      cy.get('[data-testid="select:priority"]').invoke('text').then((selectedPriority) => {
        prioritiesArray.push(selectedPriority.trim());
        cy.log(`Added value: ${selectedPriority.trim()}`);
        cy.log(`Current array length: ${prioritiesArray.length}`);
      });

      // Access all options in the dropdown
      cy.get('[data-testid^="select-option:"]').each(($el) => {
        cy.wrap($el).invoke('text').then((text) => {
          prioritiesArray.push(text.trim());
          cy.log(`Added value: ${text.trim()}`);
          cy.log(`Current array length: ${prioritiesArray.length}`);
        });
      }).then(() => {
        // Trim all values in the array again to ensure consistency
        prioritiesArray = prioritiesArray.map(item => item.trim());

        // Step 3: Check for hidden characters or unexpected issues
        prioritiesArray.forEach((value, index) => {
          const charCodes = value.split('').map(char => char.charCodeAt(0));
          cy.log(`Value at index ${index}: ${value}, Char Codes: ${charCodes.join(', ')}`);
        });

        cy.log('Final prioritiesArray:', JSON.stringify(prioritiesArray));

        // Assert that the array has the expected length
        expect(prioritiesArray).to.have.length(expectedLength);

      });

      // Step 2: Validate the reporter name contains only characters

      // Access the reporter name and check that it contains only letters and spaces
      cy.get('[data-testid="select:reporter"]').invoke('text').then((reporterName) => {
        cy.log(`Reporter name: ${reporterName.trim()}`);
        expect(reporterName.trim()).to.match(/^[A-Za-z\s]+$/);
      });
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});
