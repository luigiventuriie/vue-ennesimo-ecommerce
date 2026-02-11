describe('Wishlist Flow', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/')
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')
    cy.get('[data-test="login-button"]').click()
    cy.wait(1000)
  })

  it('should add item to wishlist from product card', () => {
    // Click wishlist button on first product card
    cy.get('[data-test="product-wishlist-btn"]').first().click()

    // Verify wishlist badge appears
    cy.get('[data-test="wishlist-badge"]').should('be.visible')
    cy.get('[data-test="wishlist-badge"]').should('contain', '1')

    // Verify heart icon is filled
    cy.get('[data-test="product-wishlist-btn"]').first().should('have.class', 'active')
  })

  it('should remove item from wishlist', () => {
    // Add item to wishlist
    cy.get('[data-test="product-wishlist-btn"]').first().click()
    cy.wait(500)

    // Verify badge shows 1
    cy.get('[data-test="wishlist-badge"]').should('contain', '1')

    // Click again to remove
    cy.get('[data-test="product-wishlist-btn"]').first().click()

    // Verify badge is gone
    cy.get('[data-test="wishlist-badge"]').should('not.exist')

    // Verify heart icon is not filled
    cy.get('[data-test="product-wishlist-btn"]').first().should('not.have.class', 'active')
  })

  it('should add item to wishlist from product page', () => {
    // Navigate to product page
    cy.get('.product-card').first().click()

    // Wait for page to load
    cy.url().should('include', '/product/')

    // Click wishlist button
    cy.get('[data-test="product-wishlist-btn"]').first().click()

    // Verify wishlist badge updates
    cy.get('[data-test="wishlist-badge"]').should('contain', '1')
  })

  it('should navigate to wishlist view and display items', () => {
    // Add item to wishlist
    cy.get('[data-test="product-wishlist-btn"]').first().click()
    cy.wait(500)

    // Navigate to wishlist
    cy.get('[data-test="wishlist-btn"]').click()

    // Verify wishlist page loaded
    cy.url().should('include', '/wishlist')

    // Verify item is displayed
    cy.get('.product-card').should('have.length', 1)
  })

  it('should add multiple items to wishlist', () => {
    // Add first item
    cy.get('[data-test="product-wishlist-btn"]').eq(0).click()
    cy.wait(300)

    // Add second item
    cy.get('[data-test="product-wishlist-btn"]').eq(1).click()
    cy.wait(300)

    // Add third item
    cy.get('[data-test="product-wishlist-btn"]').eq(2).click()
    cy.wait(300)

    // Verify badge shows 3
    cy.get('[data-test="wishlist-badge"]').should('contain', '3')

    // Navigate to wishlist
    cy.get('[data-test="wishlist-btn"]').click()

    // Verify all items are displayed
    cy.get('.product-card').should('have.length', 3)
  })

  it('should remove item from wishlist view', () => {
    // Add item to wishlist
    cy.get('[data-test="product-wishlist-btn"]').first().click()
    cy.wait(500)

    // Navigate to wishlist
    cy.get('[data-test="wishlist-btn"]').click()

    // Remove item
    cy.get('[data-test="product-wishlist-btn"]').first().click()

    // Verify item is removed from view
    cy.get('.product-card').should('have.length', 0)

    // Verify empty state is shown
    cy.contains('Your wishlist is empty').should('be.visible')
  })

  it('should persist wishlist after page reload', () => {
    // Add item to wishlist
    cy.get('[data-test="product-wishlist-btn"]').first().click()
    cy.wait(500)

    // Reload page
    cy.reload()

    // Verify wishlist badge still shows item
    cy.get('[data-test="wishlist-badge"]').should('contain', '1')

    // Verify heart is still filled
    cy.get('[data-test="product-wishlist-btn"]').first().should('have.class', 'active')
  })

  it('should clear wishlist on logout', () => {
    // Add item to wishlist
    cy.get('[data-test="product-wishlist-btn"]').first().click()
    cy.wait(500)

    // Verify wishlist has items
    cy.get('[data-test="wishlist-badge"]').should('be.visible')

    // Logout
    cy.get('[data-test="logout-btn"]').click()

    // Login again
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')
    cy.get('[data-test="login-button"]').click()
    cy.wait(1000)

    // Verify wishlist is empty
    cy.get('[data-test="wishlist-badge"]').should('not.exist')
  })

  it('should sync wishlist state between product card and product page', () => {
    // Add to wishlist from product card
    cy.get('[data-test="product-wishlist-btn"]').first().click()
    cy.wait(500)

    // Navigate to product page
    cy.get('.product-card').first().click()

    // Verify wishlist button is active on product page
    cy.get('[data-test="product-wishlist-btn"]').should('have.class', 'active')

    // Remove from wishlist on product page
    cy.get('[data-test="product-wishlist-btn"]').first().click()

    // Go back to home
    cy.get('.logo-img').click()

    // Verify wishlist button is not active on product card
    cy.get('[data-test="product-wishlist-btn"]').first().should('not.have.class', 'active')
  })
})
