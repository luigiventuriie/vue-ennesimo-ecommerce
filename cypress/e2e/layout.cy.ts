describe('Global Layout', () => {
  it('visits the app root url and sees the header', () => {
    cy.visit('/')
    cy.get('header.app-header').should('be.visible')
  })

  it('displays navigation links on desktop', () => {
    cy.viewport(1280, 720)
    cy.visit('/')
    cy.get('.category-nav.desktop').should('be.visible')
    cy.contains('Electronics')
  })

  it('hides desktop navigation on mobile', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    cy.get('.category-nav.desktop').should('not.be.visible')
  })

  it('shows hamburger button on mobile', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Verify hamburger button is visible
    cy.get('[aria-label="Open menu"]').should('be.visible')
  })

  it('opens mobile menu when clicking hamburger button', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Click hamburger button
    cy.get('[aria-label="Open menu"]').click()
    
    // Verify mobile menu is open
    cy.get('.mobile-menu-overlay.open').should('be.visible')
    cy.get('.mobile-menu-content').should('be.visible')
    
    // Verify menu contains categories
    cy.get('.nav-section').should('be.visible')
    cy.contains('Categories').should('be.visible')
  })

  it('closes mobile menu when clicking close button', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Open menu
    cy.get('[aria-label="Open menu"]').click()
    cy.get('.mobile-menu-overlay.open').should('be.visible')
    
    // Close menu
    cy.get('[aria-label="Close menu"]').click()
    
    // Verify menu is closed
    cy.get('.mobile-menu-overlay.open').should('not.exist')
  })

  it('closes mobile menu when clicking overlay', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Open menu
    cy.get('[aria-label="Open menu"]').click()
    cy.get('.mobile-menu-overlay.open').should('be.visible')
    
    // Click overlay (outside menu content)
    cy.get('.mobile-menu-overlay').click('right')
    
    // Verify menu is closed
    cy.get('.mobile-menu-overlay.open').should('not.exist')
  })
})
