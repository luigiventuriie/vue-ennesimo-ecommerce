describe('Cart Flow', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/')
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')
    cy.get('[data-test="login-button"]').click()
    cy.wait(1000)
  })

  it('should add item to cart from product page', () => {
    // Navigate to a product
    cy.get('.product-card').first().click()

    // Wait for product page to load
    cy.url().should('include', '/product/')

    // Verify add to cart button is visible
    cy.get('[data-test="add-to-cart-btn"]').should('be.visible')

    // Click add to cart
    cy.get('[data-test="add-to-cart-btn"]').click()

    // Verify cart badge updates
    cy.get('.cart-badge').should('be.visible')
    cy.get('.cart-badge').should('contain', '1')

    // Verify quantity selector appears
    cy.get('.quantity-selector').should('be.visible')
  })

  it('should increment quantity in cart', () => {
    // Add item to cart
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)

    // Increment quantity
    cy.get('[aria-label="Increase quantity"]').click()

    // Verify quantity updated
    cy.get('.qty-value').should('contain', '2')

    // Verify cart badge updated
    cy.get('.cart-badge').should('contain', '2')
  })

  it('should decrement quantity in cart', () => {
    // Add item and increment
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)
    cy.get('[aria-label="Increase quantity"]').click()
    cy.wait(500)

    // Decrement quantity
    cy.get('[aria-label="Decrease quantity"]').click()

    // Verify quantity updated
    cy.get('.qty-value').should('contain', '1')

    // Verify cart badge updated
    cy.get('.cart-badge').should('contain', '1')
  })

  it('should remove item when quantity reaches 0', () => {
    // Add item to cart
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)

    // Decrement to 0
    cy.get('[aria-label="Decrease quantity"]').click()

    // Verify add to cart button is back
    cy.get('[data-test="add-to-cart-btn"]').should('be.visible')

    // Verify cart badge is gone or shows 0
    cy.get('.cart-badge').should('not.exist')
  })

  it('should navigate to cart view and display items', () => {
    // Add item to cart
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)

    // Navigate to cart
    cy.get('[data-test="cart-btn"]').click()

    // Verify cart page loaded
    cy.url().should('include', '/cart')

    // Verify item is displayed
    cy.get('.cart-item').should('have.length', 1)

    // Verify total is displayed
    cy.get('.summary-row.total').should('be.visible')
  })

  it('should update cart total when quantity changes', () => {
    // Add item to cart
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)

    // Go to cart
    cy.get('[data-test="cart-btn"]').click()

    // Get initial total
    cy.get('.summary-row.total')
      .invoke('text')
      .then((initialTotal) => {
        // Increment quantity
        cy.get('[aria-label="Increase quantity"]').first().click()
        cy.wait(500)

        // Verify total increased
        cy.get('.summary-row.total').invoke('text').should('not.equal', initialTotal)
      })
  })

  it('should persist cart after page reload', () => {
    // Add item to cart
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)

    // Reload page
    cy.reload()

    // Verify cart badge still shows item
    cy.get('.cart-badge').should('contain', '1')
  })

  it('should clear cart on logout', () => {
    // Add item to cart
    cy.get('.product-card').first().click()
    cy.get('[data-test="add-to-cart-btn"]').click()
    cy.wait(500)

    // Verify cart has items
    cy.get('.cart-badge').should('be.visible')

    // Logout
    cy.get('[data-test="logout-btn"]').click()

    // Login again
    cy.get('[aria-label="Open login modal"]').click()
    cy.get('[data-test="username-input"]').type('johnd')
    cy.get('[data-test="password-input"]').type('m38rmF$')
    cy.get('[data-test="login-button"]').click()
    cy.wait(1000)

    // Verify cart is empty
    cy.get('.cart-badge').should('not.exist')
  })
})
