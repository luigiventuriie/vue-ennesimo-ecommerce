describe('Global Layout', () => {
  it('visits the app root url and sees the header', () => {
    cy.visit('/')
    cy.get('header.app-header').should('be.visible')
  })

  it('displays navigation links on desktop', () => {
    cy.viewport(1280, 720)
    cy.visit('/')
    cy.get('.desktop-nav').should('be.visible')
    cy.contains('Electronics')
  })

  it('hides desktop navigation on mobile', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    cy.get('.desktop-nav').should('not.be.visible')
  })
})
