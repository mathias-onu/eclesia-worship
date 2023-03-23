describe("Basic presentation flow", () => {
  it("should add a song to the playlist, add the song the the pre-presentation section, and the present the song", () => {
    // ARRANGE
    cy.visit('/')

    // ACT
    cy.get('[data-testid="addSongToPlaylistBtn"]').eq(0).click()
    cy.get('[data-testid="addSongToPresentationBtn"]').eq(0).click()

    // ASSERT
    cy.get('[data-testid="displayVerseBtn"]').should('be.visible')
  })
})