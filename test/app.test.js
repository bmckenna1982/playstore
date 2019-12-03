const { expect } = require('chai')
const app = require('../app')

describes('GET /apps endpoint', () => {
  it('Should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.at.least(1)
        const app = res.body[0]
        expect(app).to.include.all.keys('App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', "Genres", "Last Updated", 'Current Ver', 'Android Ver')
      })
  })

  it('Should return 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'invalid' })
      .expect(400, 'Sort must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card')
  })

  it('Should sort by genre', () => {
    return supertest(app)
      .get('apps')
      .query({ sort: 'Action'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        let sorted = true

        let i = 0
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (appAtIPlus1.genres < appAtI.genres) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      })
  })
})