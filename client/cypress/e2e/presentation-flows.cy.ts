describe("Testing basic presentation flows.", () => {
  beforeEach(() => {
    // ARRANGE
    cy.visit('/')

    // Seeding the database
    // Requesting an access token
    cy.request({
      url: 'http://localhost:5000/refresh-token',
      method: 'POST',
    }).then(token => {
      // Syncing songs
      cy.request({
        url: 'http://localhost:5000/sync/songs',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.body.access_token!}`
        },
        timeout: 200000
      }).then(syncedSongs => {
        if (syncedSongs.isOkStatusCode) {
          cy.log('Database has been seeded successfully!')
        }
      })
      // Syncing playlists
      cy.request({
        url: 'http://localhost:5000/sync/playlists',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.body.access_token!}`
        },
        timeout: 200000
      }).then(syncedPlaylists => {
        if (syncedPlaylists.isOkStatusCode) {
          cy.log('Database has been seeded successfully!')
        }
      })
    })
  })

  it("should add a song to the playlist, add the song the the pre-presentation section, and the present the song", () => {
    // ACT
    cy.get('[data-testid="searchSongsInput"]').type('Biruitor', { force: true })
    cy.get('[data-testid="searchSongsBtn"]').click()
    cy.get('span').contains('Biruitor', { timeout: 5000 }).siblings('div').find('[data-testid="addSongToPlaylistBtn"]').eq(0).click()

    cy.get('[data-testid="addSongToPresentationBtn"]').eq(0).click()

    // ASSERT
    cy.get('[data-testid="displayVerseBtn"]').should('be.visible')
  })

  it("should open the playlists dialog, select the latest playlist, and present the first song from the playlist", () => {
    // ACT   
    cy.get('[data-testid="openPlaylistSearchBtn"]').click()
    cy.get('[data-testid="expandPlaylistBtn"]').eq(0).click()
    cy.get('[data-testid="selectPlaylistBtn"]').eq(0).click()
    cy.get('[data-testid="addSongToPresentationBtn"]').eq(0).click()

    // ASSERT
    cy.get('[data-testid="displayVerseBtn"]').should('be.visible')
  })

  it("should click on the 'Bible' tab, open the Bible books and chapter dialog, select a book and chapter, and then present the given passage", () => {
    // ACT   
    cy.get('span').contains('Bible').click()
    cy.get('[data-testid="openBibleBooksBtn"]').click()
    cy.get('[data-testid="selectOTBookBtn"]').eq(1).click()
    cy.get('[data-testid="selectChapterBtn"]').eq(0).click()
    cy.get('[data-testid="addPassageToPresentationBtn"]').click()

    // ASSERT
    cy.get('[data-testid="displayPassageBtn"]').should('be.visible')
  })

  it("should click on the 'Bible' tab, search for a passage, and then present the given passage", () => {
    // ACT   
    cy.get('span').contains('Bible').click()
    cy.get('[data-testid="searchBibleInput"]').type('Romani 3:23-24', { force: true })
    cy.get('[data-testid="searchPassagesBtn"]').click()
    cy.get('[data-testid="addVerseToPresentationBtn"]', { timeout: 5000 }).eq(0).click()
    cy.get('[data-testid="addVerseToPresentationBtn"]').eq(1).click()

    // ASSERT
    cy.get('[data-testid="displayPassageBtn"]').should('be.visible')
  })
})