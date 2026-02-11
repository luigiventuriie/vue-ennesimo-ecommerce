describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should successfully open modal', () => {
    // Click login button in auth section
    cy.get('[aria-label="Open login modal"]').click()

    // Verify modal is open
    cy.get('[data-test="login-modal"]').should('be.visible')
  })

  it('should successfully login with valid credentials', () => {
    // Click login button in auth section
    cy.get('[aria-label="Open login modal"]').click()

    // Verify modal is open
    cy.get('[data-test="login-modal"]').should('be.visible')

    // Fill in credentials (using FakeStoreAPI test user)
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')

    // Submit form
    cy.get('[data-test="login-button"]').click()

    // Wait for login to complete
    cy.wait(1000)

    // Verify modal is closed
    cy.get('[data-test="login-modal"]').should('not.exist')

    // Verify user is logged in (auth section shows user info)
    cy.get('[data-test="user-greeting"]').should('be.visible')
    cy.get('[data-test="user-greeting"]').should('contain', 'john')

    // Verify logout button is visible
    cy.get('[data-test="logout-btn"]').should('be.visible')

    // Verify cart and wishlist buttons are visible
    cy.get('[data-test="cart-btn"]').should('be.visible')
    cy.get('[data-test="wishlist-btn"]').should('be.visible')
  })

  it('should show error message with invalid credentials', () => {
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="login-modal"]').should('be.visible')

    // Enter invalid credentials
    cy.get('[data-test="username-input"]').type('invaliduser')
    cy.get('[data-test="password-input"]').type('wrongpassword')

    cy.get('[data-test="login-button"]').click()

    // Verify error message is shown
    cy.get('.error-message').should('be.visible')

    // Verify modal is still open
    cy.get('[data-test="login-modal"]').should('be.visible')
  })

  it('should close modal when clicking close button', () => {
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="login-modal"]').should('be.visible')

    // Click close button
    cy.get('[data-test="close-modal"]').click()

    // Verify modal is closed
    cy.get('[data-test="login-modal"]').should('not.exist')
  })

  it('should successfully logout', () => {
    // Login first
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')
    cy.get('[data-test="login-button"]').click()
    cy.wait(1000)

    // Verify logged in
    cy.get('[data-test="user-greeting"]').should('be.visible')

    // Click logout
    cy.get('[data-test="logout-btn"]').click()

    // Verify logged out (login button is back)
    cy.get('[aria-label="Open login modal"]').should('be.visible')
    cy.get('[data-test="user-greeting"]').should('not.exist')

    // Verify cart and wishlist buttons are hidden
    cy.get('[data-test="cart-btn"]').should('not.exist')
    cy.get('[data-test="wishlist-btn"]').should('not.exist')
  })

  it('should persist auth state after page reload', () => {
    // Login
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')
    cy.get('[data-test="login-button"]').click()
    cy.wait(1000)

    // Reload page
    cy.reload()

    // Verify still logged in
    cy.get('[data-test="user-greeting"]').should('be.visible')
    cy.get('[data-test="logout-btn"]').should('be.visible')
  })
})
