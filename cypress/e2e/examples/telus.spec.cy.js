let url = "https://www.telus.com/"
let query = "internet";
let searchIndex = 2; //3rd search entry
let pageIndex = 1;
let minArtcles = 5;

let searchTerm;
let title;

/**
 * Normalizes passed text,
 * useful before comparing text with spaces and different capitalization.
 * @param {string} s Text to normalize
*/
const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()

// Test Scenario
context('Telus.Com Search', () => {

  // Before running any scenario below, make sure the view port is properly set and the url is loaded
  before(() => {
    cy.viewport(1400, 1000)
    cy.visit(url, { failOnStatusCode: false })
  })

  // Test Case: Search the telus portal and validate results
  it('Search "Internet" and follow links', () => {

    // Click the search button
    cy.get('#search-button').click()

    // Type the query in the search input field
    cy.get('[placeholder="Search TELUS.com"]').type(`${query}`)

    // From the listed results, click on the desired item
    cy.contains('Top Results').parent().within(() => {
      cy.root().get('ul li', { force: true }).eq(searchIndex).within(() => {
        cy.root().get('a').click()
      })
    })
    
    // Upon successful completion of the click event and page is navigated to results
    .then(() => {

      // Extract the current value of the search input field and stored in "searchTerm" variable
      cy.get('[placeholder="Search"]')
        .invoke('val')
        .then(($val) => {
          searchTerm = $val
          cy.log('searchTerm', searchTerm)
        })
        
        // Wait until the search operation is completed and variable value is properly assigned.
        .then(() => {

          // Verify the heading matches with the search term displayed in the text field.
          cy.contains('Search results for ')
            .invoke('text')
            .should('eq', `Search results for “${searchTerm}”`)

          // Location Articles section and verify it's content
          cy.contains('Articles')
            .invoke('text')
            .should('eq', 'Articles')

          // From Articles heading, locate all the results displayed below it; and within them
          cy.contains('Articles').parent().siblings('div').within(() => {
            
            // Assert the least expected articles are displayed on the page
            cy.root().get('ul li').should('have.length.at.least', minArtcles);

            // Identify the article which user want to click; and within the article
            cy.root().get('ul li').eq(pageIndex).within(() => {

              // Identify the h2 heading and capture it to "title" variable; Normalize for consistent results
              cy.root().get('h2').invoke('text').then(($title) => {
                title = normalizeText($title)
                cy.log('Clicking the page with title:', title)
              })
            })

            // Follow the link in selected article and click it
            cy.root().get('ul li').eq(pageIndex).click()

          })
          
          // Upon the article verfication and click events are completed and page is reloaded; 
          .then(() => {

            // Verify the text disaplayed on the new page 'breadcrumb' matches with the value captured in "title"
            cy.get('nav[aria-label="Breadcrumb"] ol li:last div').invoke('text').then((_title) => {
              expect(normalizeText(_title), 'Title of the page').to.equal(title)
            })
          })
        })
    })
  })

})
