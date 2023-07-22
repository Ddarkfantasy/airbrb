/* eslint-disable no-undef */
import 'cypress-file-upload';
import "cypress-real-events";

describe('Creates a new listing from jsonfile', () => {
  it('should navigate to home page', () => {
    cy.visit('localhost:3000');
  })
  // login the account we just registered
  it('should open login form', () => {
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="loginFormOpenButton"]').click();
  })
  it('should fill in login form', () => {
    cy.get('input[name="loginEmail"]')
      .focus()
      .type('333@333.com')
      .should('have.value', '333@333.com');
    
    cy.get('input[name="loginPassword"]')
      .focus()
      .type('123')
      .should('have.value', '123');
  })
  it('should upload a json to a listing and publish it', () => {
    // login
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(100);

    // navigate to create listing page
    cy.get('div[name="switchToHosting"]').click();
    cy.wait(100);

    // should have 0 listing card, because we just created the account
    cy.get('.hostingMediaCard').should('have.length', 1);

    cy.get('button[name="hostingMenuButton"]').click();
    cy.wait(100);
    cy.get('li[name="openCreateListingPageButton"]').click();
    cy.wait(100);

    /* fill the create form */
    cy.get('[name="uploadJsonButton"]').invoke('show');
    cy.get('#uploadJsonInput')
      .attachFile('../../../2.6.json');
    cy.wait(200);
    cy.get('button[name="stage1next"]').click();
    cy.get('button[name="stage2next"]').click();
    cy.get('button[name="stage3next"]').click();
    cy.get('button[name="stage4next"]').click();
    cy.get('button[name="stage5next"]').click();
    cy.get('button[name="stage6next"]').click();
    cy.get('button[name="submitListing"]').click();
    cy.wait(200);
    cy.get('.hostingMediaCard').should('have.length', 2);

    // publish the new listing
    cy.get('.hostingMediaCard').eq(1).get('div[name="publishButton"]').click();
    cy.wait(200);
    const calendar = cy.get('.purple').eq(2);
    calendar.get('span').eq(90).click();
    calendar.get('span').eq(91).click();
    calendar.get('span').eq(92).click();
    calendar.get('span').eq(93).click();
    calendar.get('span').eq(94).click();
    calendar.get('span').eq(95).click();
    calendar.get('span').eq(28).click();
    calendar.get('span').eq(29).click();
    cy.get('button[name="publish"]').click();
    cy.wait(200);

  })
})

describe('user use the filter and check rate', () => {
  it('should navigate to home page', () => {
    cy.visit('localhost:3000');
  })
  // login the account we just registered
  it('should open login form', () => {
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="loginFormOpenButton"]').click();
  })
  it('should fill in login form', () => {
    cy.get('input[name="loginEmail"]')
      .focus()
      .type('1@1.com')
      .should('have.value', '1@1.com');
    
    cy.get('input[name="loginPassword"]')
      .focus()
      .type('123')
      .should('have.value', '123');
  })
  it('should play with filter and leave a review', () => {
    // login
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(100);

    // filter city and name
    cy.get('#searchInput')
      .focus()
      .type('Hayden')
      .type('{enter}');
    cy.get('button[name="search"]').click();
    cy.get('#searchInput')
      .focus()
      .type('Armidale')
      .type('{enter}');
    cy.get('button[name="search"]').click();
    

    // filter bedroom number
    cy.get('button[name="openFilter"]').click();
    cy.wait(100);
    cy.get('input[aria-labelledby="bedroom-number"]').eq(0)
      .click({force: true})
    cy.realType('{rightarrow}'.repeat(10),{force: true});
    cy.get('[class^=MuiBackdrop-root]').click();
    cy.get('button[name="search"]').click();

    // filter price
    cy.get('button[name="openFilter"]').click();
    cy.wait(100);
    cy.get('input[aria-labelledby="bedroom-number"]').eq(0)
      .click({force: true})
    cy.realType('{leftarrow}'.repeat(15),{force: true});

    cy.get('input[aria-labelledby="price-range"]').eq(0)
      .click({force: true})
    cy.realType('{rightarrow}'.repeat(1),{force: true});
    cy.get('[class^=MuiBackdrop-root]').click();
    cy.get('button[name="search"]').click();

    // filter the date 1
    cy.get('button[name="openFilter"]').click();
    cy.wait(100);

    cy.get('input[aria-labelledby="price-range"]').eq(0)
      .click({force: true})
    cy.realType('{leftarrow}'.repeat(2),{force: true});


    cy.get('input[name="endDate"]').clear();
    cy.get('input[name="startDate"]').clear();
    cy.get('.test-start').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[aria-label="Next month"]').click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(19).click();
    cy.wait(100);
    cy.get('.test-end').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[aria-label="Next month"]').click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(21).click();
    cy.wait(100);
    // close the drawer
    cy.get('[class^=MuiBackdrop-root]').click();
    cy.get('button[name="search"]').click();

    // filter the date 2
    cy.get('button[name="openFilter"]').click();
    cy.wait(100);
    cy.get('input[name="endDate"]').clear();
    cy.get('input[name="startDate"]').clear();
    cy.get('.test-start').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(5).click();
    cy.wait(100);
    cy.get('.test-end').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(8).click();
    cy.wait(100);
    // close the drawer
    cy.get('[class^=MuiBackdrop-root]').click();
    cy.get('button[name="search"]').click();

    // enter the listing page
    cy.get('#listing0').get('.myCardContent').first().click();
    // change date inside listing page
    cy.wait(100);
    cy.get('input[name="endDate"]').clear();
    cy.get('input[name="startDate"]').clear();
    cy.get('.test-start').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(18).click();
    cy.wait(100);
    cy.get('.test-end').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(22).click();
    cy.wait(100);

    // leave a Review again
    cy.get('#leaveReview')
      .focus()
      .type('Second review, the house is nice!')
      .should('have.value', 'Second review, the house is nice!');
    cy.get('.css-dqr9h-MuiRating-label').eq(4).click();
    cy.get('button[name="saveReview"]').click();

     /* customer log out the app */
     cy.get('button[name="travelHeaderMenuButton"]').click();
     cy.wait(200);
     cy.get('li[name="logoutButton"]').click();
     cy.wait(200);
  })
})

describe('host delete a listing', () => {
  it ('should delete a listing', () => {
    // login
    cy.visit('localhost:3000');
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="loginFormOpenButton"]').click();
    cy.get('input[name="loginEmail"]')
      .focus()
      .type('333@333.com')
      .should('have.value', '333@333.com');
    
    cy.get('input[name="loginPassword"]')
      .focus()
      .type('123')
      .should('have.value', '123');
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(1000);

    cy.get('div[name="switchToHosting"]').click();
    cy.wait(100);

    cy.get('div[name="deleteButton"]').eq(1).click();
    cy.wait(200);
    cy.get('button[name="deleteConfirm"]').click();
  })
})
