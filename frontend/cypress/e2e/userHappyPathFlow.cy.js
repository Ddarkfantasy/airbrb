/* eslint-disable no-undef */
import 'cypress-file-upload';

describe('Registers successfully(for the host)', () => {
  it('should navigate to home page', () => {
    cy.visit('localhost:3000');
  })

  it('should open register form', () => {
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="registerFormOpenButton"]').click();
  })

  it('should fill in register form', () => {
    cy.get('input[name="registerEmail"]')
      .focus()
      .type('333@333.com')
      .should('have.value', '333@333.com');

    cy.get('input[name="registerUserName"]')
      .focus()
      .type('lhj')
      .should('have.value', 'lhj');
    
    cy.get('input[name="registerPassword"]')
      .focus()
      .type('123')
      .should('have.value', '123');

    cy.get('input[name="registerPassword2"]')
      .focus()
      .type('123')
      .should('have.value', '123');
  })

  it('should submit register form', () => {
    cy.get('button[name="registerConfirmButton"]').click();
  })
})

describe('Creates a new listing and publish it successfully', () => {
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
  it('should create a listing', () => {
    // login
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(100);

    // navigate to create listing page
    cy.get('div[name="switchToHosting"]').click();
    cy.wait(100);

    // should have 0 listing card, because we just created the account
    cy.get('.hostingMediaCard').should('have.length', 0);

    cy.get('button[name="hostingMenuButton"]').click();
    cy.wait(100);
    cy.get('li[name="openCreateListingPageButton"]').click();
    cy.wait(100);

    /* fill the create form */

    // stage 1: select type
    cy.url().should('include', '/hosting/create');
    cy.get('div[name="option3"]').click();
    cy.get('button[name="stage1next"]').click();

    // stage 2: set room number
    // change bathroom number
    cy.get('button[name="subBathButton"]').click();
    cy.get('button[name="addBathButton"]').click();
    cy.get('button[name="addBathButton"]').click();
    cy.get('span[name="bathroomNumber"]').should('have.text', '2');
    // change bedroom number
    cy.get('button[name="addRoomButton"]').click();
    cy.get('button[name="addRoomButton"]').click();
    // add a new room type
    cy.get('button[name="addBedTypeFor1"]').click();
    cy.wait(100);
    cy.get('h6[name="sofaBed"]').click();
    // change number of the room type
    cy.get('button[name="addsofaBedfor1"]').click();
    cy.get('button[name="subsingleBedfor1"]').click();
    // delete a room
    cy.get('button[name="delete0"]').click();
    cy.get('button[name="stage2next"]').click();

    // stage 3: set address
    // select tate
    cy.get('#select-state').click();
    cy.wait(100);
    cy.get('li[name="VIC"]').click();
    // select city
    cy.get('#select-city').click();
    cy.wait(100);
    cy.get('li[name="Colac"]').click();
    // input street
    cy.get('#street-input')
      .focus()
      .type('botany street')
      .should('have.value', 'botany street');
    cy.get('button[name="stage3next"]').click();

    // stage 4: set amenities
    cy.get('div[name="Amenitystandout3"]').click();
    cy.get('div[name="Amenitystandout6"]').click();
    cy.get('div[name="Amenitybasics2"]').click();
    cy.get('div[name="Amenitybasics5"]').click();
    cy.get('div[name="Amenitysafety0"]').click();
    cy.get('button[name="stage4next"]').click();

    // stage 5: upload photos
    cy.get('.hiddenInput1').invoke('show');
    cy.get('#uploadThumbnail')
      .attachFile('../../src/assets/building.jpg');
    cy.wait(500);
    cy.get('.hiddenInput2').invoke('show');
    cy.get('#uploadImages')
      .focus()
      .attachFile('../../src/assets/room.jpg');
    cy.wait(500);
    cy.get('#uploadImages')
      .focus()
      .attachFile('../../src/assets/spring.jpg');
    cy.wait(500);
    cy.get('button[name="stage5next"]').click();

    // stage 6: set title
    cy.get('#title')
    .focus()
    .type('my test listing1')
    .should('have.value', 'my test listing1');
    cy.get('button[name="stage6next"]').click();

    // stage 7: set price
    cy.get('#price')
    .focus()
    .type('233')
    .should('have.value', '0233');
    cy.get('button[name="submitListing"]').click();

    // check if the listing is created successfully
    cy.wait(2000);
    // should have 1 listing card
    cy.get('.hostingMediaCard').should('have.length', 1);


    // update the listing thumbnail and title
    cy.get('.hostingMediaCard').first().get('div[name="editButton"]').click();
    cy.wait(1000);
    // check url
    cy.url().should('include', '/hosting/edit');
    cy.get('button[name="stage1next"]').click();
    cy.get('button[name="stage2next"]').click();
    cy.get('button[name="stage3next"]').click();
    cy.get('button[name="stage4next"]').click();
    // update thumbnail
    cy.get('#thumbnail').click();
    cy.get('.hiddenInput0').invoke('show');
    cy.get('#updateThumbnail')
      .attachFile('../../src/assets/house.jpg');
    cy.wait(500);
    cy.get('button[name="stage5next"]').click();
    // update the title
    cy.get('#title')
    .focus()
    .clear()
    .type('Hayden big house')
    .should('have.value', 'Hayden big house');
    cy.get('button[name="stage6next"]').click();
    cy.get('button[name="submitListing"]').click();
    
    /* publish a listing successfully */
    cy.wait(1000);
    cy.get('.hostingMediaCard').first().get('div[name="publishButton"]').click();
    cy.wait(500);
    const calendar = cy.get('.purple').first();
    calendar.get('span').eq(10).click();
    calendar.get('span').eq(11).click();
    calendar.get('span').eq(12).click();
    calendar.get('span').eq(13).click();
    calendar.get('span').eq(14).click();
    calendar.get('span').eq(15).click();
    calendar.get('span').eq(16).click();
    calendar.get('span').eq(17).click();
    calendar.get('span').eq(28).click();
    calendar.get('span').eq(29).click();
    cy.get('button[name="publish"]').click();
    cy.wait(500);

    /* unPublish the listing */
    cy.get('.hostingMediaCard').first().get('div[name="unPublishButton"]').click();
    cy.wait(500);
    cy.get('button[name="unpublishConfirm"]').click();
    cy.wait(1000);

    /* publish again */
    cy.get('.hostingMediaCard').first().get('div[name="publishButton"]').click();
    cy.wait(500);
    const calendar2 = cy.get('.purple').first();
    calendar2.get('span').eq(10).click();
    calendar2.get('span').eq(11).click();
    calendar2.get('span').eq(12).click();
    calendar2.get('span').eq(13).click();
    calendar2.get('span').eq(14).click();
    calendar2.get('span').eq(15).click();
    calendar2.get('span').eq(26).click();
    calendar2.get('span').eq(27).click();
    calendar2.get('span').eq(28).click();
    calendar2.get('span').eq(29).click();
    cy.get('button[name="publish"]').click();
  })
})

describe('Registers successfully (for the customer)', () => {
  it('should navigate to home page', () => {
    cy.visit('localhost:3000');
  })

  it('should open register form', () => {
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="registerFormOpenButton"]').click();
  })

  it('should fill in register form', () => {
    cy.get('input[name="registerEmail"]')
      .focus()
      .type('1@1.com')
      .should('have.value', '1@1.com');

    cy.get('input[name="registerUserName"]')
      .focus()
      .type('Hayden')
      .should('have.value', 'Hayden');
    
    cy.get('input[name="registerPassword"]')
      .focus()
      .type('123')
      .should('have.value', '123');

    cy.get('input[name="registerPassword2"]')
      .focus()
      .type('123')
      .should('have.value', '123');
  })

  it('should submit register form', () => {
    cy.get('button[name="registerConfirmButton"]').click();
  })
})

describe('Customer send a book request and the host accept it', () => {
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
  it('book a listing', () => {
    // login
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(100);

    /* book a listing successfully */
    cy.get('button[name="openFilter"]').click();
    cy.wait(100);
    // filter the date
    cy.get('.test-start').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(4).click();
    cy.wait(100);
    cy.get('.test-end').first().find('button').first().click();
    cy.wait(100);
    cy.get('button[role=gridcell]').eq(7).click();
    cy.wait(100);
    // close the drawer
    cy.get('[class^=MuiBackdrop-root]').click();
    cy.get('button[name="search"]').click();
    // go to the listing page
    cy.get('#listing0').get('.myCardContent').first().click();

    // make a book request
    cy.wait(500);
    cy.get('button[name="bookButton"]').click();
    cy.wait(100);
    cy.get('button[name="bookButton"]').click();

    /* customer log out the app */
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="logoutButton"]').click();
    cy.wait(1000);

    /* login as the host */
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
    // login
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(200);
    // to host page
    cy.get('div[name="switchToHosting"]').click();
    cy.get('.hostingMediaCard').first().get('div[name="checkBookingButton"]').click();
    cy.wait(300);
    cy.get('button[name="check0"]').click();
    cy.wait(300);
    cy.get('button[name="acceptBook"]').click();
    cy.wait(300);
    cy.get('button[name="check0"]').click();
    cy.get('button[name="rejectBook"]').click();

    // check the status of the booking is accepted
    /* host log out the app */
    cy.get('button[name="hostingMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="logoutButton"]').click();
    cy.wait(200);

    // login as the customer
    cy.get('button[name="travelHeaderMenuButton"]').click();
    cy.wait(200);
    cy.get('li[name="loginFormOpenButton"]').click();
    cy.get('input[name="loginEmail"]')
      .focus()
      .type('1@1.com')
      .should('have.value', '1@1.com');
    cy.get('input[name="loginPassword"]')
      .focus()
      .type('123')
      .should('have.value', '123');
    cy.get('button[name="loginConfirmButton"]').click();
    cy.wait(100);

    // open the booking page again
    cy.get('#listing0').get('.myCardContent').first().click();

    // leave a review
    cy.get('#leaveReview')
      .focus()
      .type('This is a review')
      .should('have.value', 'This is a review');
    cy.get('.css-dqr9h-MuiRating-label').eq(2).click();
    cy.get('button[name="saveReview"]').click();
  })
})