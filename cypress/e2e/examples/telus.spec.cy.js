let query = "internet";
let searchIndex = 2; //3rd search entry
let pageIndex = 1;

let searchTerm;
let title;

/**
 * Normalizes passed text,
 * useful before comparing text with spaces and different capitalization.
 * @param {string} s Text to normalize
*/
const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()

context('Telus.Com Search', () => {
  before(() => {
    cy.viewport(1400, 1000)
    cy.visit('https://www.telus.com/', { failOnStatusCode: false })
  })

  it('Search "Internet" and follow links', () => {

    // Click the search button
    cy.get('#search-button').click()

    // Type the query and enter
    cy.get('[placeholder="Search TELUS.com"]').type(`${query}`)


    cy.contains('Top Results').parent().within(() => {
      cy.root().get('ul li', { force: true }).eq(searchIndex).within(() => {
        cy.root().get('a').click()
      })
    }).then(() => {


      // cy.get('[aria-label="search and cart"] div div div div ul li').eq(searchIndex).click()


      // cy.get('[placeholder="Search"]').clear().type(query)
      // .then(($input) => { 
      //   searchTerm = $input.text() 
      //   console.log('searchTerm', searchTerm)
      //   expect(searchTerm.includes('internet')).to.be.true 
      // })

      // cy.get('#app div div div div ul li').eq(searchIndex).click()

      cy.get('[placeholder="Search"]')
        // //   // .click()
        // //   // cy.get('#app div div div div ul li').eq(1)
        // //   .invoke('text')
        //   // .invoke('val')
        //   // .then(($val)=>{
        //   //     console.log('value =============================>' + $val)
        //   //     searchTerm = $val;
        //   // })
        //   .first()
        // .should('have.value', 'Internet not working')
        .invoke('val')
        .then(($div) => {
          //     // we can massage text before comparing
          cy.log('div is', $div)
          searchTerm = $div
          cy.log('searchTerm', searchTerm)
          // expect(searchTerm, 'Search term').to.equal('Internet not working')
        }).then(() => {


          cy.contains('Search results for ')
            .invoke('text')
            // .should('match', /Search results for/i)
            .should('eq', `Search results for “${searchTerm}”`)

          // cy.wait()

          cy.contains('Articles')
            .invoke('text')
            .should('eq', 'Articles')

          cy.contains('Articles').parent().siblings('div').within(() => {

            // cy.root.get('div').eq(2).get('div div div').eq(2).get('ul li').eq('1').click()
            cy.root().get('ul li').eq(pageIndex).within(() => {
              cy.root().get('h2').invoke('text').then(($title) => {
                title = normalizeText($title)
                cy.log('Clicking the page with title:', title)
              })
            })

            cy.root().get('ul li').eq(pageIndex).click()

          }).then(() => {

            cy.get('nav[aria-label="Breadcrumb"] ol li:last div').invoke('text').then((_title) => {
              expect(normalizeText(_title), 'Title of the page').to.equal(title)
            })
          })
        })
    })
  })

})
